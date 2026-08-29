globalThis.COURSE_DATA = {
  "title": "C# 高级动画课程",
  "subtitle": "从委托到 AOT",
  "updatedAt": "2026-08-29T10:05:54.603Z",
  "stats": {
    "chapters": 16,
    "lessons": 180,
    "published": 11,
    "produced": 8,
    "planned": 161
  },
  "chapters": [
    {
      "number": 1,
      "title": "委托与事件",
      "start": 1,
      "end": 6,
      "lessons": [
        {
          "number": 1,
          "title": "委托概述",
          "duration": "3分33秒",
          "status": "已发布",
          "description": "HR 信息录入窗需要把处理方式交给主窗，借这个需求认识委托、签名与回调。"
        },
        {
          "number": 2,
          "title": "多播与预定义委托",
          "duration": "3分43秒",
          "status": "已发布",
          "description": "一次操作需要触发多段处理，学习调用列表、Action、Func 与 Predicate。"
        },
        {
          "number": 3,
          "title": "策略模式",
          "duration": "3分36秒",
          "status": "已发布",
          "description": "斧头面对不同物体时不再堆叠判断，把变化的处理逻辑独立出来。"
        },
        {
          "number": 4,
          "title": "依赖注入",
          "duration": "3分37秒",
          "status": "已发布",
          "description": "策略对象又依赖音效、经验与资源计算器，用构造注入和容器接管对象创建。"
        },
        {
          "number": 5,
          "title": "事件与标准事件模式",
          "duration": "2分39秒",
          "status": "已发布",
          "description": "交通监控不再反复轮询警察局，用事件完成受控的发布与订阅。"
        },
        {
          "number": 6,
          "title": "观察者模式",
          "duration": "3分9秒",
          "status": "已发布",
          "description": "订阅者数量和类型不断变化时，用观察者结构整理一对多通知。"
        }
      ]
    },
    {
      "number": 2,
      "title": "现代化泛型",
      "start": 7,
      "end": 15,
      "lessons": [
        {
          "number": 7,
          "title": "泛型具化",
          "duration": "3分3秒",
          "status": "已发布",
          "description": "Buffer 和 List 需要保存不同类型的数据，再从这个用途进入泛型的运行时表示与静态字段。"
        },
        {
          "number": 8,
          "title": "泛型约束",
          "duration": "3分21秒",
          "status": "已发布",
          "description": "Pair<T> 不能凭空调用比较方法，用约束明确 T 必须具备的能力。"
        },
        {
          "number": 9,
          "title": "Liskov代换与泛型变体",
          "duration": "3分25秒",
          "status": "已发布",
          "description": "普通继承赋值到了泛型里为何失效，借读写边界理解协变与逆变。"
        },
        {
          "number": 10,
          "title": "适配器模式",
          "duration": "3分11秒",
          "status": "已发布",
          "description": "第三方组件与现有接口不一致时，用包装与泛型约束完成接入。"
        },
        {
          "number": 11,
          "title": "运算符重载",
          "duration": "3分15秒",
          "status": "已发布",
          "description": "Fraction.Add 不如加号自然，用运算符和用户定义转换改善类型的使用体验。"
        },
        {
          "number": 12,
          "title": "静态抽象接口成员",
          "duration": "3分38秒",
          "status": "已制作",
          "description": "泛型算法也想调用加号，借接口中的静态抽象成员描述这种能力。"
        },
        {
          "number": 13,
          "title": "泛型数学",
          "duration": "3分15秒",
          "status": "已制作",
          "description": "用标准数值接口复用求和与平均值，并区分完整数值、浮点语义和最小能力约束。"
        },
        {
          "number": 14,
          "title": "自引用泛型与强类型工厂",
          "duration": "3分15秒",
          "status": "已制作",
          "description": "行数据需要创建具体对象时，用静态工厂与自引用约束保留准确返回类型。"
        },
        {
          "number": 15,
          "title": "泛型 API 的约束设计",
          "duration": "3分45秒",
          "status": "已制作",
          "description": "从 Parse 和 CompareTo 等真实操作反推约束，避免无谓缩小调用范围。"
        }
      ]
    },
    {
      "number": 3,
      "title": "自定义集合与迭代协议",
      "start": 16,
      "end": 25,
      "lessons": [
        {
          "number": 16,
          "title": "索引器",
          "duration": "3分15秒",
          "status": "已制作",
          "description": "让自定义 FractionList 支持 list[i]，同时处理越界和只读访问。"
        },
        {
          "number": 17,
          "title": "Index 与 Range",
          "duration": "3分15秒",
          "status": "已制作",
          "description": "集合既要支持从尾部取值，也要支持区间切片，补全现代索引语法。"
        },
        {
          "number": 18,
          "title": "集合接口的选择",
          "duration": "3分52秒",
          "status": "已制作",
          "description": "ICollection、IList 与 IReadOnlyList 各自承诺什么，按真实用途选择最小接口。"
        },
        {
          "number": 19,
          "title": "IEnumerable 与 IEnumerator",
          "duration": "3分38秒",
          "status": "已制作",
          "description": "让自定义 DispatchBatch 同时进入 foreach 与 IEnumerable<T> API，拆开集合入口与枚举器状态。"
        },
        {
          "number": 20,
          "title": "foreach 的编译器展开",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "观察 GetEnumerator、MoveNext 和 Current，理解循环语法背后的调用顺序。"
        },
        {
          "number": 21,
          "title": "yield return",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "手写枚举器状态太多时，用 yield 写出按需产生元素的遍历逻辑。"
        },
        {
          "number": 22,
          "title": "迭代器状态机",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "同一段 yield 代码为何能暂停再继续，从编译器生成类型解释运行过程。"
        },
        {
          "number": 23,
          "title": "遍历期间修改集合",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "集合边遍历边修改会破坏什么，用版本号检测让错误尽早出现。"
        },
        {
          "number": 24,
          "title": "集合表达式与自定义构建器",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "让自定义集合接受 [a, b, c]，理解集合表达式怎样选择构建路径。"
        },
        {
          "number": 25,
          "title": "迭代器模式",
          "duration": "3–5分钟",
          "status": "计划·模式",
          "description": "文件、树节点和分页结果来源不同，却都能通过同一遍历接口逐项消费。"
        }
      ]
    },
    {
      "number": 4,
      "title": "扩展方法与流式 API",
      "start": 26,
      "end": 34,
      "lessons": [
        {
          "number": 26,
          "title": "静态工具为何越写越乱",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "订单处理需要连续校验、折扣和格式化，从层层嵌套的静态调用发现问题。"
        },
        {
          "number": 27,
          "title": "扩展方法",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "让原有类型在不修改源码的情况下获得点号调用，并理解 this 参数的作用。"
        },
        {
          "number": 28,
          "title": "扩展方法的查找顺序",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "同名成员、不同命名空间和重载同时出现时，判断编译器最终选择哪一个。"
        },
        {
          "number": 29,
          "title": "泛型扩展与类型推断",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "给任意序列补充通用操作，让调用方少写类型参数又不失去约束。"
        },
        {
          "number": 30,
          "title": "返回值决定链条能否继续",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "每一步返回什么类型，决定下一步还能点出哪些操作。"
        },
        {
          "number": 31,
          "title": "流式 API 的边界",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "把顺序明确的步骤连成链，同时识别副作用、异常和调试困难何时应该拆开。"
        },
        {
          "number": 32,
          "title": "Builder 模式与有效配置",
          "duration": "3–5分钟",
          "status": "计划·模式",
          "description": "报表配置拥有多项必填参数和无效中间状态，用 Build 统一检查并生成最终对象。"
        },
        {
          "number": 33,
          "title": "C# 14 extension 块",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "在 extension 块中组织方法、属性和静态成员，并与传统扩展写法对照。"
        },
        {
          "number": 34,
          "title": "扩展索引器（C# 15 预览）",
          "duration": "4–5分钟",
          "status": "选修·预览",
          "description": "为不能修改源码的类型补充索引访问，观察它适合解决的问题和当前限制。"
        }
      ]
    },
    {
      "number": 5,
      "title": "LINQ 与查询组合",
      "start": 35,
      "end": 48,
      "lessons": [
        {
          "number": 35,
          "title": "从循环到查询管线",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "把订单筛选、变换和统计从多段循环整理成一条仍然看得懂的处理链。"
        },
        {
          "number": 36,
          "title": "Where 与 Select",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "分清留下哪些元素和把元素变成什么，避免把筛选与投影揉在一起。"
        },
        {
          "number": 37,
          "title": "SelectMany",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "一个订单里还有多条明细时，把嵌套集合展开成可以继续查询的一层序列。"
        },
        {
          "number": 38,
          "title": "排序与比较器",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "按金额、时间和自定义优先级排序，并处理稳定排序与 ThenBy。"
        },
        {
          "number": 39,
          "title": "GroupBy 与 Lookup",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "订单按客户归组后要反复查询，比较临时分组与可重复查找的 Lookup。"
        },
        {
          "number": 40,
          "title": "Join 与 GroupJoin",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "两份数据没有导航属性时，按键关联订单、客户和明细。"
        },
        {
          "number": 41,
          "title": "聚合与种子值",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "从 Sum、Count 走到 Aggregate，理解空序列与初始值怎样影响结果。"
        },
        {
          "number": 42,
          "title": "查询表达式怎样翻译",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "from、where、let、join 最终如何变成方法调用，方便在两种写法间切换。"
        },
        {
          "number": 43,
          "title": "延迟执行",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "查询定义后数据又发生变化，解释为何枚举时才真正执行。"
        },
        {
          "number": 44,
          "title": "重复枚举与物化",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "同一查询执行两遍可能重复访问文件或数据库，判断何时使用 ToList。"
        },
        {
          "number": 45,
          "title": "闭包与循环变量",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "查询条件捕获外部变量后出现意外结果，跟踪闭包对象和变量生命周期。"
        },
        {
          "number": 46,
          "title": "自定义 LINQ 运算符",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "业务需要批量、滑动窗口或带索引筛选时，基于迭代器扩充运算符。"
        },
        {
          "number": 47,
          "title": "从 IEnumerable 到远端查询",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "同一条条件接入数据库后，查询提供程序必须先读懂条件，再决定怎样执行。"
        },
        {
          "number": 48,
          "title": "Specification 模式",
          "duration": "3–5分钟",
          "status": "计划·模式",
          "description": "多处重复组合业务条件时，把可复用条件封装成规格并保留组合能力。"
        }
      ]
    },
    {
      "number": 6,
      "title": "异常、资源与可恢复边界",
      "start": 49,
      "end": 60,
      "lessons": [
        {
          "number": 49,
          "title": "失败发生在哪里",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "从读取损坏文件开始，区分可预期失败、程序缺陷与真正需要捕获的异常。"
        },
        {
          "number": 50,
          "title": "异常类型与自定义异常",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "调用方需要采取不同恢复动作时，用准确的异常类型传递语义。"
        },
        {
          "number": 51,
          "title": "堆栈与重新抛出",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "保留原始故障位置，比较 throw、throw ex 与异常包装。"
        },
        {
          "number": 52,
          "title": "异常筛选器",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "同一种异常只有部分情况可以恢复时，在进入 catch 前完成条件判断。"
        },
        {
          "number": 53,
          "title": "捕获、记录与恢复",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "决定哪一层真正知道怎样恢复，避免每层都捕获、重复记录或悄悄吞掉异常。"
        },
        {
          "number": 54,
          "title": "finally 与清理保证",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "无论成功、失败还是提前返回，都要让临时状态得到恢复。"
        },
        {
          "number": 55,
          "title": "IDisposable 与 using",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "文件句柄不能等待 GC，借 using 建立确定性的释放时机。"
        },
        {
          "number": 56,
          "title": "对象所有权与 Dispose 模式",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "多个对象共享同一资源时，先确定谁创建、谁持有、谁负责释放。"
        },
        {
          "number": 57,
          "title": "Stream 与 Decorator 模式",
          "duration": "3–5分钟",
          "status": "计划·模式",
          "description": "压缩、加密和缓冲需要叠加在同一数据流上，用包装保持组合能力。"
        },
        {
          "number": 58,
          "title": "测试失败路径",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "让读取中断、构造失败和释放异常都能被重复验证，而不是只测试成功流程。"
        },
        {
          "number": 59,
          "title": "Result 模型",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "验证失败属于正常业务结果时，不用异常控制日常分支。"
        },
        {
          "number": 60,
          "title": "验证链与责任链模式",
          "duration": "3–5分钟",
          "status": "计划·模式",
          "description": "多条校验既要按顺序执行又能随时增加，用责任链组织可停止的处理步骤。"
        }
      ]
    },
    {
      "number": 7,
      "title": "异步编程模型",
      "start": 61,
      "end": 74,
      "lessons": [
        {
          "number": 61,
          "title": "阻塞等待的代价",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "批量下载时线程大多时间只在等待，从响应性和吞吐量看异步的价值。"
        },
        {
          "number": 62,
          "title": "Task 表示什么",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "把尚未完成的操作连同结果、异常和状态封装成可观察对象。"
        },
        {
          "number": 63,
          "title": "async 与 await",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "把回调式下载流程改成顺序可读的代码，同时保持等待期间不占用线程。"
        },
        {
          "number": 64,
          "title": "异步状态机",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "await 前后局部变量去了哪里，理解编译器如何保存并恢复执行位置。"
        },
        {
          "number": 65,
          "title": "异步异常与 async void",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "异常何时进入 Task、何时重新抛出，并把 async void 限制在事件边界。"
        },
        {
          "number": 66,
          "title": "Task.WhenAll",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "多个互不依赖的请求一起等待，并正确收集结果和异常。"
        },
        {
          "number": 67,
          "title": "WhenAny、超时与竞速",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "只取最快镜像或限制等待时间时，处理未获胜任务的后续状态。"
        },
        {
          "number": 68,
          "title": "CancellationToken",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "取消是协作请求，不是强行终止；让整条调用链都能及时响应。"
        },
        {
          "number": 69,
          "title": "TaskCompletionSource",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "把旧式回调和事件包装成可以等待的 Task，并正确处理完成、失败与取消。"
        },
        {
          "number": 70,
          "title": "进度报告",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "后台任务持续汇报百分比和阶段信息，同时保持核心逻辑不依赖界面。"
        },
        {
          "number": 71,
          "title": "同步上下文、死锁与 ConfigureAwait",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "界面线程为何可能互相等待，以及库代码何时不必回到原上下文。"
        },
        {
          "number": 72,
          "title": "ValueTask",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "高频调用经常同步完成时，权衡少一次分配与更复杂的使用约束。"
        },
        {
          "number": 73,
          "title": "IAsyncDisposable",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "关闭网络连接还要等待异步刷新时，用 await using 完成收尾。"
        },
        {
          "number": 74,
          "title": "异步流",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "数据分批到达时，用 IAsyncEnumerable 边接收边处理，并响应取消。"
        }
      ]
    },
    {
      "number": 8,
      "title": "并发与数据协作",
      "start": 75,
      "end": 88,
      "lessons": [
        {
          "number": 75,
          "title": "I/O 并发与 CPU 并行",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "判断任务是在等待还是在计算，避免把 async、线程和并行混为一谈。"
        },
        {
          "number": 76,
          "title": "线程池与任务调度",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "大量短任务如何复用线程，理解调度器能保证什么、不能保证什么。"
        },
        {
          "number": 77,
          "title": "竞态条件",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "库存扣减偶尔出现负数时，用时间线还原读改写之间的竞争。"
        },
        {
          "number": 78,
          "title": "lock、Monitor 与 System.Threading.Lock",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "把必须作为整体完成的操作围成临界区，并比较专用 Lock 与普通监视器。"
        },
        {
          "number": 79,
          "title": "Interlocked 与 Volatile",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "计数器和状态标志不必都上大锁，但原子性与可见性不能混淆。"
        },
        {
          "number": 80,
          "title": "内存顺序与安全发布",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "一个线程创建的对象如何让另一个线程看到完整状态。"
        },
        {
          "number": 81,
          "title": "单例模式与并发初始化",
          "duration": "3–5分钟",
          "status": "计划·模式",
          "description": "共享实例第一次创建时既要唯一又要安全，比较静态初始化与 Lazy<T>。"
        },
        {
          "number": 82,
          "title": "SemaphoreSlim 与读写锁",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "限制并发连接数或实现读多写少时，选择比互斥锁更合适的工具。"
        },
        {
          "number": 83,
          "title": "死锁",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "两把锁以不同顺序获取会怎样，用固定顺序和超时消除循环等待。"
        },
        {
          "number": 84,
          "title": "并发集合",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "生产者和消费者同时更新集合时，使用专门的原子操作而不是外层猜测。"
        },
        {
          "number": 85,
          "title": "不可变快照",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "配置读多写少时，用整体替换减少细粒度锁和半更新状态。"
        },
        {
          "number": 86,
          "title": "Channel 与生产者消费者",
          "duration": "3–5分钟",
          "status": "计划·模式",
          "description": "采集速度和处理速度不同，用有界通道连接两个独立阶段。"
        },
        {
          "number": 87,
          "title": "背压与关闭流程",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "消费者跟不上时不能无限堆积，设计等待、丢弃、完成和故障传播。"
        },
        {
          "number": 88,
          "title": "Parallel 与 PLINQ",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "CPU 密集计算确实可拆分时，评估分区开销、顺序和取消。"
        }
      ]
    },
    {
      "number": 9,
      "title": "类型建模与模式匹配",
      "start": 89,
      "end": 103,
      "lessons": [
        {
          "number": 89,
          "title": "值、身份与状态",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "订单快照和用户实体看起来都是对象，但相等语义和变化方式并不相同。"
        },
        {
          "number": 90,
          "title": "record 与值相等",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "不可变消息需要按内容比较时，用 record 减少重复样板。"
        },
        {
          "number": 91,
          "title": "相等性与哈希",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "对象进入 Dictionary 或 HashSet 后必须保持一致的 Equals 与 GetHashCode 契约。"
        },
        {
          "number": 92,
          "title": "with、init 与非破坏更新",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "保留旧快照并只修改少量字段时，不再手工复制所有成员。"
        },
        {
          "number": 93,
          "title": "required 成员",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "对象离开初始化阶段前必须具备关键数据，让遗漏在编译期暴露。"
        },
        {
          "number": 94,
          "title": "主构造函数",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "构造参数既参与初始化又贯穿类型实现时，控制作用域和可变状态。"
        },
        {
          "number": 95,
          "title": "元组与解构",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "方法需要返回多个紧密相关的临时结果时，避免为了搬运数据创建空壳类型。"
        },
        {
          "number": 96,
          "title": "类型模式与常量模式",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "面对不同结果类型时，用模式直接取得所需数据。"
        },
        {
          "number": 97,
          "title": "属性、关系与列表模式",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "把嵌套条件写成与数据形状对应的匹配表达式。"
        },
        {
          "number": 98,
          "title": "switch 表达式与穷尽性",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "状态分支必须覆盖完整，利用编译器提示漏掉的情况。"
        },
        {
          "number": 99,
          "title": "sealed 与继承边界",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "某个具体实现不应再被继承时使用 sealed；有限类型集合留到预览课继续讨论。"
        },
        {
          "number": 100,
          "title": "可空引用类型",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "让编译器跟踪 null 流向，把空引用问题提前到编辑阶段。"
        },
        {
          "number": 101,
          "title": "可空标注与泛型",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "Try 方法、成员状态和泛型返回值需要更精确地告诉编译器何时为空。"
        },
        {
          "number": 102,
          "title": "状态模式",
          "duration": "3–5分钟",
          "status": "计划·模式",
          "description": "订单状态开始拥有各自的允许操作时，把大段 switch 移入独立状态对象。"
        },
        {
          "number": 103,
          "title": "联合类型与闭合层次（C# 15 预览）",
          "duration": "4–5分钟",
          "status": "选修·预览",
          "description": "用预览语法观察受限结果集合的另一种建模方式，并与现有写法比较。"
        }
      ]
    },
    {
      "number": 10,
      "title": "反射、特性与动态装配",
      "start": 104,
      "end": 117,
      "lessons": [
        {
          "number": 104,
          "title": "Type 与运行时类型",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "插件目录只给出程序集和类型名时，从 Type 找到实际类型信息。"
        },
        {
          "number": 105,
          "title": "MemberInfo 与 BindingFlags",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "按公开范围、实例或静态成员准确查找属性、方法和构造函数。"
        },
        {
          "number": 106,
          "title": "泛型反射",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "识别开放泛型、闭合泛型和泛型参数，并按约束构造具体类型。"
        },
        {
          "number": 107,
          "title": "动态创建对象",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "配置文件决定实现类型时，选择构造函数并提供参数。"
        },
        {
          "number": 108,
          "title": "从 Invoke 到缓存委托",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "反复反射调用太慢且容易出错，把已找到的方法转换成可复用委托。"
        },
        {
          "number": 109,
          "title": "自定义特性",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "在类型和成员上附加声明式元数据，让框架读取而不侵入业务逻辑。"
        },
        {
          "number": 110,
          "title": "特性驱动验证",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "模型属性声明验证规则，运行时统一发现并执行。"
        },
        {
          "number": 111,
          "title": "工厂模式",
          "duration": "3–5分钟",
          "status": "计划·模式",
          "description": "创建规则开始分支后，用工厂集中选择实现，并保留调用方所需接口。"
        },
        {
          "number": 112,
          "title": "程序集装载与插件发现",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "用 AssemblyLoadContext 装载插件，再扫描实现和特性完成注册。"
        },
        {
          "number": 113,
          "title": "重新理解 DI 容器",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "回到第 04 节的容器，补全生命周期、作用域、循环依赖和构造函数选择。"
        },
        {
          "number": 114,
          "title": "泛型特性",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "特性参数需要携带类型时，用泛型特性避免运行时 Type 转换。"
        },
        {
          "number": 115,
          "title": "dynamic",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "调用对象的静态类型无法提前确定时，理解运行时绑定带来的便利和风险。"
        },
        {
          "number": 116,
          "title": "ExpandoObject 与 DLR",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "动态数据的成员在运行时出现，观察调用点怎样缓存绑定规则。"
        },
        {
          "number": 117,
          "title": "DispatchProxy 与代理模式",
          "duration": "3–5分钟",
          "status": "计划·模式",
          "description": "在不改业务类的情况下加入日志、重试和计时，并看清代理适用的接口边界。"
        }
      ]
    },
    {
      "number": 11,
      "title": "表达式树与动态规则",
      "start": 118,
      "end": 129,
      "lessons": [
        {
          "number": 118,
          "title": "筛选条件需要动态构建",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "用户在界面勾选条件后，程序必须在运行时拼出一段可执行且可分析的规则。"
        },
        {
          "number": 119,
          "title": "Func 与 Expression",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "相同 lambda 为何既能直接执行又能成为数据结构，比较两种目标类型。"
        },
        {
          "number": 120,
          "title": "表达式节点",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "从参数、常量、成员访问和二元运算还原一棵真实筛选树。"
        },
        {
          "number": 121,
          "title": "手动构建表达式",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "根据字段、运算符和值创建节点，并生成完整 LambdaExpression。"
        },
        {
          "number": 122,
          "title": "Compile 与执行验证",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "把手工构建的树编译成委托，确认节点结构确实表达了预期逻辑。"
        },
        {
          "number": 123,
          "title": "参数替换与条件组合",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "多条独立规则使用不同参数时，先统一参数再组合 AndAlso 与 OrElse。"
        },
        {
          "number": 124,
          "title": "ExpressionVisitor 与访问者模式",
          "duration": "3–5分钟",
          "status": "计划·模式",
          "description": "节点类型很多但遍历流程相似，用访问者集中处理遍历和分派。"
        },
        {
          "number": 125,
          "title": "不可变树与表达式改写",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "不能原地修改节点时，通过返回新节点完成规则简化和替换。"
        },
        {
          "number": 126,
          "title": "把表达式翻译成查询",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "逐节点生成参数化 SQL，再回到 IQueryable 理解提供程序读取的内容。"
        },
        {
          "number": 127,
          "title": "Specification 模式再应用",
          "duration": "3–5分钟",
          "status": "计划·模式",
          "description": "让规格既能在内存执行，也能保留表达式供远端翻译。"
        },
        {
          "number": 128,
          "title": "编译缓存与语法限制",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "稳定规则可以缓存委托，同时识别哪些语法无法直接进入表达式树。"
        },
        {
          "number": 129,
          "title": "规则 DSL 的工程边界",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "从字段白名单、类型转换、错误提示到安全限制，完成可交付的动态规则入口。"
        }
      ]
    },
    {
      "number": 12,
      "title": "内存、引用与零分配",
      "start": 130,
      "end": 144,
      "lessons": [
        {
          "number": 130,
          "title": "分配测量的最小工具",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "用分配计数和内存视图确认热点来源，为后面的每次优化保留前后数据。"
        },
        {
          "number": 131,
          "title": "值类型与引用类型的复制",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "参数传递和赋值时究竟复制了什么，解释修改为何有时互相影响。"
        },
        {
          "number": 132,
          "title": "装箱与拆箱",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "值类型进入 object、接口或非泛型 API 时产生了哪些分配和检查。"
        },
        {
          "number": 133,
          "title": "readonly struct",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "小型值对象需要不可变且避免防御性复制时，设计只读结构。"
        },
        {
          "number": 134,
          "title": "ref 局部变量与 ref 返回",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "直接操作集合中的原位置，避免取出副本后修改无效。"
        },
        {
          "number": 135,
          "title": "ref、in、out 与 scoped",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "传递大结构或借用引用时，明确读写权限和引用不能逃逸的范围。"
        },
        {
          "number": 136,
          "title": "ref struct 与 allows ref struct",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "栈上数据不能随意逃逸；泛型若要接收它，也必须把这份限制继续传递。"
        },
        {
          "number": 137,
          "title": "Span<T>",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "同一块连续内存无论来自数组还是非托管区域，都通过统一视图处理。"
        },
        {
          "number": 138,
          "title": "切片与零复制 UTF-8 解析",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "解析日志缓冲区时用 Slice 和 Range 指向原数据，不再生成大量子数组和中间字符串。"
        },
        {
          "number": 139,
          "title": "stackalloc",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "短小、上限明确的临时缓冲区放在栈上，并控制栈空间风险。"
        },
        {
          "number": 140,
          "title": "Memory<T> 与异步边界",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "缓冲区需要跨 await 或存入对象时，从 Span 过渡到可持有的内存表示。"
        },
        {
          "number": 141,
          "title": "ArrayPool 与对象池",
          "duration": "3–5分钟",
          "status": "计划·模式",
          "description": "高频租借大缓冲区时复用数组，并处理清理、归还和泄漏问题。"
        },
        {
          "number": 142,
          "title": "字符串分配与插值处理器",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "日志未启用时不应先创建整段字符串，用自定义插值处理器延迟格式化。"
        },
        {
          "number": 143,
          "title": "unsafe、指针与 fixed",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "只有边界 API 或测量证实的热点才进入不安全代码，并固定托管内存。"
        },
        {
          "number": 144,
          "title": "内存安全的预览子集（C# 15）",
          "duration": "4–5分钟",
          "status": "选修·预览",
          "description": "只讲当前可用的指针限制放宽与 unsafe(expression)，并说明 requires-unsafe 模型尚未完整开放。"
        }
      ]
    },
    {
      "number": 13,
      "title": "CLR、IL、JIT 与 GC",
      "start": 145,
      "end": 154,
      "lessons": [
        {
          "number": 145,
          "title": "程序集、元数据与托管代码",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "一份 C# 程序编译后留下什么，运行时又从哪里找到类型和方法。"
        },
        {
          "number": 146,
          "title": "IL 与求值栈",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "从运算符和方法调用的 IL 观察参数、局部变量与返回值怎样流动。"
        },
        {
          "number": 147,
          "title": "语法糖的降级结果",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "foreach、using、async 和 lambda 最终生成哪些结构，建立源码与运行行为的联系。"
        },
        {
          "number": 148,
          "title": "泛型代码共享",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "回到第 07 节，比较值类型专用代码与引用类型共享实现。"
        },
        {
          "number": 149,
          "title": "JIT、分层编译与 PGO",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "方法第一次和持续运行后的机器码为何不同，理解预热与热点优化。"
        },
        {
          "number": 150,
          "title": "内联与调用边界",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "小方法是否真的有额外成本，观察 JIT 何时内联、何时放弃。"
        },
        {
          "number": 151,
          "title": "GC 根与分代回收",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "对象何时仍被认为可达，短命对象为何通常回收得更快。"
        },
        {
          "number": 152,
          "title": "大对象堆与固定",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "大数组和 pinning 怎样影响压缩、碎片与暂停。"
        },
        {
          "number": 153,
          "title": "终结队列",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "带终结器的对象为何要多走一轮，以及为什么普通对象不应依赖它完成日常释放。"
        },
        {
          "number": 154,
          "title": "BenchmarkDotNet 与性能分析",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "从可靠基准、内存诊断到时间线分析，完成一次证据充分的优化。"
        }
      ]
    },
    {
      "number": 14,
      "title": "编译期元编程",
      "start": 155,
      "end": 162,
      "lessons": [
        {
          "number": 155,
          "title": "为什么把工作移到编译期",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "反射扫描在启动、裁剪和 AOT 场景遇到限制，确定哪些信息可以提前生成。"
        },
        {
          "number": 156,
          "title": "Roslyn 语法树",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "源码不仅是字符串，读取节点、Token 与 Trivia 并保留原始结构。"
        },
        {
          "number": 157,
          "title": "语义模型",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "同名标识符可能指向不同符号，用编译信息确认类型和绑定结果。"
        },
        {
          "number": 158,
          "title": "代码分析器",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "发现错误的 API 用法时，在编辑器中给出位置准确的诊断。"
        },
        {
          "number": 159,
          "title": "Code Fix",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "诊断不只报错，还能生成可预览、可批量应用的安全修复。"
        },
        {
          "number": 160,
          "title": "源生成器",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "根据用户代码增加注册表和辅助方法，同时明确生成器不能直接改写已有源码。"
        },
        {
          "number": 161,
          "title": "增量生成器",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "大型项目只重算受影响的输入，并让生成步骤可缓存、可测试。"
        },
        {
          "number": 162,
          "title": "生成序列化与 DI 代码",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "把前面的插件元数据转成编译期注册代码，并为裁剪和 AOT 做准备。"
        }
      ]
    },
    {
      "number": 15,
      "title": "非托管互操作与 AOT",
      "start": 163,
      "end": 170,
      "lessons": [
        {
          "number": 163,
          "title": "托管与非托管边界",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "调用系统库前先分清内存、异常和生命周期分别由谁负责。"
        },
        {
          "number": 164,
          "title": "P/Invoke 与 LibraryImport",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "从一个小型原生函数开始，比较运行时封送与源生成入口。"
        },
        {
          "number": 165,
          "title": "数据封送",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "字符串、结构体、数组和回调跨边界时，控制布局、编码与复制。"
        },
        {
          "number": 166,
          "title": "SafeHandle 管理原生句柄",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "文件、窗口或设备句柄必须可靠释放，用安全句柄承接所有权。"
        },
        {
          "number": 167,
          "title": "NativeMemory 与非托管缓冲区",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "显式申请和释放原生内存，并用 Span 建立受控视图。"
        },
        {
          "number": 168,
          "title": "函数指针与调用约定",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "高频回调无法接受普通委托开销时，理解 delegate* 和 ABI 要求。"
        },
        {
          "number": 169,
          "title": "裁剪与 Native AOT",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "分析反射、动态装载和生成代码对裁剪的影响，完成一个 AOT 发布。"
        },
        {
          "number": 170,
          "title": "什么时候不该下探",
          "duration": "3–5分钟",
          "status": "计划",
          "description": "把性能收益、平台限制、调试成本与维护风险放在一起决定技术边界。"
        }
      ]
    },
    {
      "number": 16,
      "title": "综合项目：可插拔数据处理管线",
      "start": 171,
      "end": 180,
      "lessons": [
        {
          "number": 171,
          "title": "需求与最小架构",
          "duration": "6–8分钟",
          "status": "计划·项目",
          "description": "从日志采集、动态筛选、转换和导出四步确定边界，先跑通最小闭环。"
        },
        {
          "number": 172,
          "title": "用泛型定义管线契约",
          "duration": "6–8分钟",
          "status": "计划·项目",
          "description": "为输入、输出和处理器建立强类型接口，让阶段能够安全组合。"
        },
        {
          "number": 173,
          "title": "发现与注册插件",
          "duration": "6–8分钟",
          "status": "计划·项目",
          "description": "用特性描述处理器，再比较反射发现和源生成注册表。"
        },
        {
          "number": 174,
          "title": "动态规则进入管线",
          "duration": "6–8分钟",
          "status": "计划·项目",
          "description": "把界面或配置产生的条件构造成表达式树，并复用规格组合。"
        },
        {
          "number": 175,
          "title": "Channel 串联异步阶段",
          "duration": "6–8分钟",
          "status": "计划·项目",
          "description": "让采集、转换和导出并行推进，同时通过有界容量建立背压。"
        },
        {
          "number": 176,
          "title": "取消、异常与资源收尾",
          "duration": "6–8分钟",
          "status": "计划·项目",
          "description": "任一阶段失败或用户取消时，让整条管线停止并完整释放资源。"
        },
        {
          "number": 177,
          "title": "并发指标与事件通知",
          "duration": "6–8分钟",
          "status": "计划·项目",
          "description": "在不污染核心处理器的前提下统计吞吐、失败和延迟并推送状态。"
        },
        {
          "number": 178,
          "title": "Span 与池化优化热点",
          "duration": "6–8分钟",
          "status": "计划·项目",
          "description": "只改分析器确认的解析热点，比较优化前后的分配与吞吐。"
        },
        {
          "number": 179,
          "title": "基准、裁剪与 AOT 评估",
          "duration": "6–8分钟",
          "status": "计划·项目",
          "description": "用可复现数据验证收益，再检查插件和反射对发布方式的限制。"
        },
        {
          "number": 180,
          "title": "收束、重构与发布",
          "duration": "6–8分钟",
          "status": "计划·项目",
          "description": "删去多余抽象，补齐测试和文档，解释每项高级技术为何保留或移除。"
        }
      ]
    }
  ]
};
