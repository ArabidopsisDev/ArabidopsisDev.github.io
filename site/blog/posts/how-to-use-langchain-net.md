---
title: "\u4E00\u4E07\u5B57\u4EE5\u5185\u6700\u597D\u7684Agent\u6559\u7A0B"
description: "\u6700\u8FD1\u51E0\u5929\u5728\u5B66LangChain\u548C\u4E00\u4E9BAgent\u6846\u67B6\uFF0C\u4F46\u662F\u6211\u53D1\u73B0\u57FA\u672C\u4E0A\u7F51\u4E0A\u7684\u6559\u7A0B\u90FD\u662F\u57FA\u4E8EPython\u7684\uFF0C\u597D\u5DE7\u4E0D\u5DE7\uFF0C.Net\u793E\u533A\u4E5F\u7EF4\u62A4\u4E86\u81EA\u5DF1\u7684\u4E00\u7CFB\u5217Agent\u6846\u67B6\uFF0C\u56E0\u6B64\u672C\u6587\u6765\u63A2\u8BA8\u4E00\u4E0B\u5982\u4F55\u4F7F\u7528.Net\u7EF4\u62A4\u7684\u6846\u67B6\u8FDB\u884CAgent\u5F00\u53D1\u3002"
date: 2026-09-01T06:11:00+08:00
updated: 2026-09-03T20:37:13+08:00
tags:
  - LLM
  - AI
  - .net
  - LangChain
  - agent
draft: true
---

> 提示：本文全文为人类撰写

# 前言

提到Agent开发，最出名的库自然就是LangChain，LangChain以其的高自由度，丰富的社区支持而广受好评，而因此本文会以LangChain为主线，来介绍.NET中的Agent工程。

关于.Net社区的LangChain，网上的教程并不太多，最重要的其实就是那一份官方文档，在这种情况下，我确实踩了不少坑。在这篇文章中，我会通过实际项目介绍LangChain.NET的使用方法和注意事项。同时，由于网上也没有系统性的LangChain.NET文字教程，这篇文章也可以聊作参考，起到抛砖引玉的作用。

本文使用Polyglot Notebook提供与C#的交互环境，微软大战代码（Microsoft VS Code）作为IDE，如果没有这些软件/插件建议先安装一下再继续学习。

<br/>

# 认识LangChain

我们以构建一个从中文到英文的翻译项目开始，首先来认识一下LangChain中的基本元素。在这篇文章中，我们会按照完整的学习路径来学习LangChain以及其它附属内容，例如neo4j等。

## 安装相关依赖包

出于价格原因，我们将使用 DeepSeek 作为调用的大模型，因为我们需要安装单独的 `LangChain.Providers.DeepSeek` 包，在第一个单元格中写入如下代码安装LangChain和对应的模型提供器。

```csharp
#r "nuget:LangChain, 0.15.4"
#r "nuget:LangChain.Providers.DeepSeek"
```

## 如何调用大模型

要使用大模型，首先需要配置API Key，我们可以去DeepSeek官方开放平台申请一个API Key，之后将这个Key填入环境变量，我这里的环境变量名为DSAPI。

```csharp
var apiKey = Environment.GetEnvironmentVariable("DSAPI");
```

接下来，创建一个 `config` 作为配置项，由于tryAGI草台班子的设计缺陷，在这个变量里面不但要写明白密钥，还要写上调用端点，不然将会被路由到 OpenAI 上而导致调用失败。

```csharp
var config = new DeepSeekConfiguration {
    ApiKey = apiKey,
    Endpoint = "https://api.deepseek.com" 
};

```

> 注：本文作者已经给LangChain提了一个PR以修复该问题，该PR的修复已被提交到主分支，因此这个问题已解决，如果你是用的是最新版本，那么无需再手动配置 `Endpoint`。

之后，我们便可以创建模型了，我们知道编程界最出名的第一句话就是“Hello, World!"，因此对于第一条消息，我们就来向模型发送一条"Hello, LangChain!"

```csharp
await foreach (var response in model.GenerateAsync("Hello, LangChain!"))
    Console.Write(response); 
Console.WriteLine();
```

由于模型的返回是异步流式的，因此我们使用 `await foreach` 语句来接收模型的回复并将其打印到控制台上，这样我们就完成了一个最基本的大模型调用步骤。回到这一节的主题，我们需要做的是一个翻译程序，所以每一条消息都需要包含两个部分，翻译提示词（类似于“请帮我将下列句子从英语翻译到中文”）+具体的句子。具体的句子可能会变化，但是翻译提示词一般不会变化，因此我们可以将翻译提示词作为**系统消息**，待翻译的句子做为**用户消息**。

## 用户消息与系统消息

简单来说，系统消息（提示词）的作用是设定角色和规则，是全局的设定和约束。定义 AI 的身份、语气、不能做的事以及遵循的格式。而用户消息（提示词）的作用是下达具体任务，是单次的具体请求。用户当前需要 AI 解决的具体问题或提供的信息。

下面我们来编写这个翻译器用到的用户消息和系统消息：

| 系统消息 | 用户消息 |
|:---:|:---:|
| 你是一个资深的翻译专家，将用户的句子从中文翻译到英语。| <具体句子> |

<br/>

不难看出，在系统消息中，我们设置了AI的规则，就是把一个句子从中文翻译为英文，之后用户消息为用户提供的具体句子，AI会把这个句子从中文翻译到英文。在代码中，我们构建一个 `Message` 类型的列表，第一条消息为系统消息，第二条消息为用户消息，之后将这个列表发送给大模型即可。前面我们给大模型发送的是一个字符串，在这里我们把这个字符串替换成待发送的列表。

```csharp
Message[] messages = [
    new Message("你是一个资深的翻译专家，将用户的句子从中文翻译到英语。", MessageRole.System),
    new Message("悟已往之不谏，知来者之可追。", MessageRole.Human)
];

await foreach (var response in model.GenerateAsync(messages))
    Console.Write(response); 
Console.WriteLine();
```

类型 `Message` 构造函数的第2项为消息类型，对于系统消息，应指定为 `MessageRole.System`，而对于用户消息，应指定为 `MessageRole.Human`。执行上面的代码后，模型响应为 `I have realized that the past cannot be remedied, but I know that the future can still be pursued.` 也就是说，它已经成功的将中文转换成了英文。

但是这样的系统提示词还是比较脆弱的，用户完全可以指令模型做别的事情，例如编写一个快速排序算法，这显然不是我们想看到的。到这里为止，我们的第一个翻译程序就已经跑通了，但我们的目的从来不是为了跑通，而是需要考虑如何让这个工具效果更好，更能贴合实际需求。

<br/>

# 提示词工程

## 简介

说到提示词，我们都不陌生，所谓的提示词，就是我们给大模型的指令。很多人其实都看不起提示词工程，认为只有那些不懂 AI 的人才会研究怎么用提示词。但是这是一个错误的印象，提示词工程还是很重要的，现在很多非计算机专业的文科生等，用 AI 生成的程序运行效果很差的一个重要原因就是写不好提示词。可能你平时在使用提示词时，就已经自己摸索出一些提示词工程的内容了，一般地，提示词会分为下面几个部分：

1. **指令**: 也就是你想让 AI 完成的任务。
2. **输入数据**: AI 要处理的数据。
3. **输出格式**: AI 输出内容的格式。
4. **上下文**： 提供给 AI 的额外信息（可选）。

例如在我们刚刚发送给 AI 的翻译指令中，**指令**就是要求 AI 把中文翻译成英文，**输入数据**就是悟已往之不谏，知来者之可追这两句诗词，**输出格式**就是翻译之后的英文句子。

在这个例子中，由于翻译已经是一项很成熟的任务了，所以不需要给 AI 提供例子，但是在有些任务情境下，提供一些示例才会让 AI 生成的效果更好，这就引出了我们的一项重要的提示技术——**零样本与少样本提示**。

## 样本提示技术
