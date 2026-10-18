/**
 * 题目块（question block）——markdown-it 插件。
 *
 * 两种写法完全等价，任选其一：
 *
 *   ::: question [属性...]
 *   题干（可写多段 Markdown、$行内公式$、$$独立公式$$）
 *
 *   - A. 选项一
 *   - B. 选项二
 *   :::
 *
 *   <question [属性...]>
 *   题干
 *
 *   - A. 选项一
 *   - B. 选项二
 *   </question>
 *
 * 属性（可省略，`key=value` 或不带键的位置写法都支持）：
 *   type=choice|answer   题型；缺省时"有选项"即选择题，否则解答题
 *   number=3             题号，渲染为"第 3 题"；非数字时原样输出
 *   label=例题            徽标文字，缺省为"选择题"/"解答题"
 *   answer=B             答案标记，渲染在标题行右侧
 *   中文键写法：类型 / 题号 / 标签 / 答案
 *
 * 设计取舍：题目块内部仍然交给 markdown-it 自己的块级规则处理，
 * 因此行内、独立公式、列表、代码、链接与正文完全一致；这一点是
 * 原生 HTML 标签（html_block 规则）做不到的——HTML 块里的 $…$
 * 不会被 KaTeX 插件解析。两种写法都注册成块级规则而不是源码改写，
 * 所以代码围栏里的同名文本不会被误伤。
 */

const TYPE_LABELS = Object.freeze({ choice: "选择题", answer: "解答题" });

const TYPE_WORDS = new Map([
  ["choice", "choice"],
  ["choices", "choice"],
  ["single", "choice"],
  ["singlechoice", "choice"],
  ["multiple", "choice"],
  ["multichoice", "choice"],
  ["mcq", "choice"],
  ["选择题", "choice"],
  ["选项题", "choice"],
  ["单选", "choice"],
  ["多选", "choice"],
  ["answer", "answer"],
  ["solution", "answer"],
  ["subjective", "answer"],
  ["problem", "answer"],
  ["question", "answer"],
  ["解答题", "answer"],
  ["简答题", "answer"],
  ["计算题", "answer"],
  ["证明题", "answer"],
]);

const ATTRIBUTE_ALIASES = new Map([
  ["type", "type"],
  ["kind", "type"],
  ["类型", "type"],
  ["题型", "type"],
  ["number", "number"],
  ["num", "number"],
  ["index", "number"],
  ["题号", "number"],
  ["编号", "number"],
  ["answer", "answer"],
  ["key", "answer"],
  ["答案", "answer"],
  ["label", "label"],
  ["badge", "label"],
  ["prefix", "label"],
  ["标签", "label"],
  ["前缀", "label"],
  ["标题", "label"],
]);

/** `number=none` 显式关掉题号。 */
const NO_NUMBER_PATTERN = /^(?:none|null|off|no|false|无|不编号|-|—)$/iu;

/** 自动编号按徽标（例题 / 题目 / …）各自计数，计数状态挂在本次渲染的 env 上。 */
const COUNTERS = "__questionBlockCounters__";
const fallbackCounters = Object.create(null);

const ATTRIBUTE_PATTERN = /([^\s="'}？,，]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s,}]+)))?/gu;

/** 行内列表项 / 字母标号：`- A. 选项`、`A、选项`、`（A）选项`、`1. 选项`。 */
const OPTION_PATTERNS = [
  /^[ \t]*[-*+][ \t]+(?:([A-Za-z]|\d{1,2})[ \t]*[.、．)）][ \t]*)?(\S[\s\S]*)$/u,
  /^[ \t]*(?:[（(][ \t]*([A-Za-z]|\d{1,2})[ \t]*[)）]|([A-Za-z]|\d{1,2})[ \t]*[.、．)）])[ \t]*(\S[\s\S]*)$/u,
];

/** 同一行里并排的选项标号，例如 `A. 甲 B. 乙 C. 丙 D. 丁`。 */
const INLINE_LABEL_PATTERN = /(?:^|[ \t\u3000])([A-Za-z]|\d{1,2})[ \t]*[.、．)）][ \t]*/gu;

/** 公式与行内代码里的字母不能被当成选项标号。 */
const OPAQUE_SPAN_PATTERN = /(\$\$[\s\S]*?\$\$|\$[^$\n]*\$|`[^`]*`)/gu;

export default function questionBlock(md) {
  const escape = md.utils.escapeHtml;

  md.block.ruler.before("html_block", "question_block", questionRule, {
    alt: ["paragraph", "reference", "blockquote", "list"],
  });

  md.renderer.rules.question_open = (tokens, index) => renderOpen(tokens[index], escape);

  md.renderer.rules.question_options_open = (tokens, index) => {
    const meta = tokens[index].meta || {};
    const count = Number.isFinite(meta.count) ? ` data-option-count="${meta.count}"` : "";
    return `<ol class="question-block-options"${count}>`;
  };
  md.renderer.rules.question_options_close = () => "</ol>";

  md.renderer.rules.question_option_open = (tokens, index) => {
    const meta = tokens[index].meta || {};
    return `<li class="question-block-option"><span class="question-block-option-label">${escape(meta.label || "")}</span><span class="question-block-option-body">`;
  };
  md.renderer.rules.question_option_close = () => "</span></li>";

  md.renderer.rules.question_stem_close = () => "</div>";
  md.renderer.rules.question_close = () => "</figure>";
}

function questionRule(state, startLine, endLine, silent) {
  if (state.sCount[startLine] - state.blkIndent >= 4) return false;

  const lineStart = state.bMarks[startLine] + state.tShift[startLine];
  const head = state.src.slice(lineStart, state.eMarks[startLine]).trimEnd();

  const fence = /^(:{3,})[ \t]*question(?:[ \t]+([\s\S]*))?$/iu.exec(head);
  const tag = /^<question((?:[ \t][^>]*)?)>$/iu.exec(head);
  if (!fence && !tag) return false;
  if (silent) return true;

  const marker = fence ? fence[1] : null;
  const info = fence ? fence[2] || "" : tag[1] || "";
  const attributes = parseInfo(info);

  let closeLine = -1;
  for (let line = startLine + 1; line < endLine; line += 1) {
    const text = state.src.slice(state.bMarks[line] + state.tShift[line], state.eMarks[line]).trim();
    if (fence) {
      const close = /^(:{3,})$/u.exec(text);
      if (close && close[1].length >= marker.length) {
        closeLine = line;
        break;
      }
    } else if (/^<\/question>[ \t]*$/iu.test(text)) {
      closeLine = line;
      break;
    }
  }
  if (closeLine < 0) return false;

  // 显式写了"解答题"就不再解析尾部选项；否则从末尾向上收集连续的选项行。
  const collected = attributes.type === "answer"
    ? { options: [], stemEndLine: closeLine }
    : collectOptions(state, startLine + 1, closeLine);

  const options = collected.options;
  const type = attributes.type || (options.length ? "choice" : "answer");
  const meta = {
    type,
    label: attributes.label || TYPE_LABELS[type],
    number: attributes.number || null,
    answer: attributes.answer || null,
    // 写了自定义前缀（例题 / 题目 / 练习 …）又没给题号时按前缀自动编号；
    // 默认徽标不自动编号，显式题号照旧渲染成"第 N 题"。
    numberText: formatNumber(
      resolveNumber(state, attributes),
      Boolean(attributes.label),
    ),
  };

  const oldParentType = state.parentType;
  state.parentType = "container";

  const open = state.push("question_open", "figure", 1);
  open.block = true;
  open.map = [startLine, closeLine + 1];
  open.markup = fence ? marker : "<question>";
  open.info = info;
  open.meta = meta;

  if (collected.stemEndLine > startLine + 1) {
    state.md.block.tokenize(state, startLine + 1, collected.stemEndLine);
  }
  state.push("question_stem_close", "", -1);

  if (options.length) {
    const list = state.push("question_options_open", "ol", 1);
    list.block = true;
    list.meta = { count: options.length };
    for (const option of options) {
      const item = state.push("question_option_open", "li", 1);
      item.block = true;
      item.meta = { label: option.label };
      const inline = state.push("inline", "", 0);
      // 只给 content 和空 children：core 的 inline 规则会统一解析，
      // 因此选项里的 $…$、代码、链接与正文走完全相同的规则。
      inline.content = option.text;
      inline.children = [];
      inline.map = [option.line, option.line + 1];
      state.push("question_option_close", "li", -1);
    }
    state.push("question_options_close", "ol", -1);
  }

  state.push("question_close", "figure", -1);
  state.parentType = oldParentType;
  state.line = closeLine + 1;
  return true;
}

/** 解析 `::: question` 后面的属性串，位置写法与 key=value 写法混用都可以。 */
function parseInfo(info) {
  const attributes = { type: null, number: null, label: null, answer: null };
  if (!info) return attributes;

  ATTRIBUTE_PATTERN.lastIndex = 0;
  let match;
  while ((match = ATTRIBUTE_PATTERN.exec(info))) {
    const rawKey = match[1].replace(/^[{,，]+|[},，]+$/gu, "").trim();
    if (!rawKey) continue;
    const rawValue = (match[2] ?? match[3] ?? match[4] ?? "").trim();
    const key = ATTRIBUTE_ALIASES.get(rawKey.toLowerCase());

    if (!key) {
      // 没有 "=" 的裸词：数字进题号，题型词进题型，其余当徽标文字。
      if (rawValue) continue;
      if (/^\d+$/u.test(rawKey)) attributes.number = rawKey;
      else if (TYPE_WORDS.has(rawKey.toLowerCase())) attributes.type = TYPE_WORDS.get(rawKey.toLowerCase());
      else attributes.label = rawKey;
      continue;
    }

    if (key === "type") {
      attributes.type = TYPE_WORDS.get(rawValue.toLowerCase()) || null;
    } else if (key === "number") {
      attributes.number = rawValue || null;
    } else if (key === "answer") {
      attributes.answer = rawValue || null;
    } else if (key === "label") {
      attributes.label = rawValue || null;
    }
  }
  return attributes;
}

function formatNumber(number, labelExplicit) {
  if (!number) return null;
  if (labelExplicit || !/^\d+$/u.test(number)) return number;
  return `第 ${number} 题`;
}

/**
 * 题号来源：显式 `number=` 优先（并把它记进该前缀的计数器，后续自动编号接着走）；
 * 只写了前缀时按前缀自增，于是"例题 1、例题 2"和"题目 1、题目 2"各排各的。
 */
function resolveNumber(state, attributes) {
  if (attributes.number) {
    if (NO_NUMBER_PATTERN.test(attributes.number)) return null;
    rememberNumber(state, attributes.label, attributes.number);
    return attributes.number;
  }
  if (!attributes.label) return null;
  return nextNumber(state, attributes.label);
}

function numberCounters(state) {
  const env = state.env;
  if (!env || typeof env !== "object") return fallbackCounters;
  if (!env[COUNTERS]) {
    Object.defineProperty(env, COUNTERS, {
      value: Object.create(null),
      enumerable: false,
      configurable: true,
      writable: true,
    });
  }
  return env[COUNTERS];
}

function nextNumber(state, label) {
  const counters = numberCounters(state);
  const value = (counters[label] || 0) + 1;
  counters[label] = value;
  return String(value);
}

function rememberNumber(state, label, explicit) {
  if (!label || !/^\d+$/u.test(explicit)) return;
  const counters = numberCounters(state);
  counters[label] = Math.max(counters[label] || 0, Number(explicit));
}

/**
 * 从内容末尾向上收集选项行，返回选项与题干结束行。
 * 只有"连续的末尾行"才算选项，所以正文中间的列表不会被吞掉。
 */
function collectOptions(state, fromLine, toLine) {
  const lines = [];
  for (let line = fromLine; line < toLine; line += 1) {
    lines.push(state.src.slice(state.bMarks[line], state.eMarks[line]));
  }

  let last = lines.length - 1;
  while (last >= 0 && !lines[last].trim()) last -= 1;
  if (last < 0) return { options: [], stemEndLine: toLine };

  // 第一遍：自下而上确定"末尾连续选项区"的起点。
  let regionStart = last + 1;
  let baseline = -1;
  let matched = 0;
  for (let index = last; index >= 0; index -= 1) {
    const line = lines[index];
    if (!line.trim()) continue;

    const indent = line.length - line.trimStart().length;
    if (matched > 0 && indent > baseline) {
      regionStart = index; // 比选项更深的缩进是选项续行（也挡住选项内嵌的小列表）
      continue;
    }

    const match = matchOption(line);
    if (!match) break;
    baseline = baseline < 0 ? indent : Math.min(baseline, indent);
    matched += 1;
    regionStart = index;
  }
  if (!matched) return { options: [], stemEndLine: toLine };

  // 第二遍：自上而下解析，续行归它上方那个选项。
  const options = [];
  for (let index = regionStart; index <= last; index += 1) {
    const line = lines[index];
    if (!line.trim()) continue;

    const indent = line.length - line.trimStart().length;
    const match = indent > baseline ? null : matchOption(line);
    if (match) {
      options.push({ label: match.label, text: match.text, line: fromLine + index });
      continue;
    }
    if (options.length) {
      const current = options[options.length - 1];
      current.text = `${current.text} ${line.trim()}`;
    }
  }

  const normalized = normalizeLabels(options).flatMap(expandInlineOption);
  if (normalized.length < 2 && !normalized.some((option) => /^[A-Za-z]$/u.test(option.label))) {
    return { options: [], stemEndLine: toLine };
  }
  return { options: normalized, stemEndLine: fromLine + regionStart };
}

function matchOption(line) {
  const listItem = OPTION_PATTERNS[0].exec(line);
  if (listItem) return { label: listItem[1] || null, text: listItem[2].trim() };

  const label = OPTION_PATTERNS[1].exec(line);
  if (label) return { label: label[1] || label[2] || null, text: label[3].trim() };

  return null;
}

function normalizeLabels(options) {
  return options.map((option, index) => ({
    ...option,
    label: option.label
      ? option.label.toUpperCase()
      : String.fromCharCode(65 + Math.min(index, 25)),
  }));
}

/** `A. 甲  B. 乙  C. 丙  D. 丁` 写在一行时按标号拆开。 */
function expandInlineOption(option) {
  if (!/^[A-Za-z]$/u.test(option.label)) return [option];

  const markers = inlineMarkers(option.text).filter((marker) => marker.start > 0);
  if (!markers.length) return [option];

  const cuts = [];
  let expected = nextLabel(option.label);
  for (const marker of markers) {
    if (!expected || marker.label !== expected) continue;
    cuts.push(marker);
    expected = nextLabel(expected);
  }
  if (!cuts.length) return [option];

  const parts = [{ label: option.label, text: option.text.slice(0, cuts[0].start).trim(), line: option.line }];
  cuts.forEach((cut, index) => {
    const end = index + 1 < cuts.length ? cuts[index + 1].start : option.text.length;
    parts.push({ label: cut.label, text: option.text.slice(cut.end, end).trim(), line: option.line });
  });
  return parts.filter((part) => part.text);
}

function inlineMarkers(text) {
  const opaque = opaqueRanges(text);
  const markers = [];
  INLINE_LABEL_PATTERN.lastIndex = 0;
  let match;
  while ((match = INLINE_LABEL_PATTERN.exec(text))) {
    const label = match[1];
    const start = match.index + match[0].indexOf(label);
    if (opaque.some(([begin, end]) => start > begin && start < end)) continue;
    markers.push({ label: label.toUpperCase(), start, end: INLINE_LABEL_PATTERN.lastIndex });
  }
  return markers;
}

function opaqueRanges(text) {
  const ranges = [];
  OPAQUE_SPAN_PATTERN.lastIndex = 0;
  let match;
  while ((match = OPAQUE_SPAN_PATTERN.exec(text))) {
    ranges.push([match.index, match.index + match[0].length]);
  }
  return ranges;
}

function nextLabel(label) {
  if (/^\d+$/u.test(label)) {
    const value = Number(label) + 1;
    return value <= 99 ? String(value) : null;
  }
  const code = label.toUpperCase().charCodeAt(0);
  return code >= 65 && code < 90 ? String.fromCharCode(code + 1) : null;
}

function renderOpen(token, escape) {
  const meta = token.meta || {};
  const kind = meta.type === "choice" ? "choice" : "answer";
  const source = (token.attrs || [])
    .map(([name, value]) => ` ${name}="${escape(value)}"`)
    .join("");

  const title = [`<span class="question-block-label">${escape(meta.label || TYPE_LABELS[kind])}</span>`];
  if (meta.numberText) title.push(`<span class="question-block-number">${escape(meta.numberText)}</span>`);
  const answer = meta.answer
    ? `<span class="question-block-answer">答案 <b>${escape(meta.answer)}</b></span>`
    : "";

  return `<figure class="question-block question-block--${kind}" data-question-type="${kind}"${source}>`
    + `<div class="question-block-head"><span class="question-block-title">${title.join("")}</span>${answer}</div>`
    + '<div class="question-block-stem">';
}
