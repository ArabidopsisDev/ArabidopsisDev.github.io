import source from "./rearrangeContent.json" with { type: "json" };
const chapters = new Map(Object.values(source).flat().map((chapter) => [chapter.sourceIndex, chapter]));
const clean = (text) => text.replace(/\s+/gu, "").replace(/(?<=。)0$/u, "");

// Each expansion has one continuous primary narrative, rather than a stack
// of unrelated page excerpts. Repair PDF chunk boundaries at sentence ends.
function paragraphs(text) {
  const sentences = text.match(/[^。！？]+[。！？]+[”」]?|[^。！？]+$/gu) || [text];
  const result = [];
  let pending = "";
  for (const sentence of sentences) {
    pending += sentence;
    const balanced = (pending.match(/“/gu) || []).length === (pending.match(/”/gu) || []).length;
    if (pending.length >= 170 && balanced) { result.push(pending); pending = ""; }
  }
  if (pending) {
    if (pending.length < 65 && result.length) result[result.length - 1] += pending;
    else result.push(pending);
  }
  return result;
}
const definitions = [
  { slug: "family-film", title: "把很多年前剪进一部电影", sourceIndex: 4, era: "2020—2025", lenses: ["becoming", "release"], question: "七分钟的时间线，装得下多少年的生活？", lead: "给弟弟的毕业电影，从旧录像开始，也留下了成片、工程与记忆之间的接缝。", links: ["archive-seams", "home-morning"], turnLabel: "成片坏了以后，留下的是过程", turnNote: "回到硬盘，看文件如何保存、也如何漏掉生活。" },
  { slug: "one-person-studio", title: "一个人的工作室", sourceIndex: 5, era: "2018—2026", lenses: ["becoming", "unknown"], question: "部门已经写齐，伙伴却还没有出现。", lead: "MethodBox 先是一个人的招牌，后来才慢慢有别人走进来。", links: ["collective-night", "rules-with-exit", "first-window"], turnLabel: "从空荡的部门表走向真实队友", turnNote: "不同的人愿意回来，比一个组织名称更具体。" },
  { slug: "folders-before-git", title: "文件夹就是版本控制", sourceIndex: 7, era: "2020", lenses: ["unknown"], question: "“最终版”和“.bak”之间，怎样留下学习现场？", lead: "网课、家庭录像、脚本和工程挤在同一块硬盘上；最早的技术问题，也从那里长出来。", links: ["first-window", "family-film", "writer-dashboard"], turnLabel: "从一个目录走回第一扇窗口", turnNote: "文件名很混乱，动手的兴奋却已经发生。" },
  { slug: "machine-registration", title: "考试机为什么要有注册", sourceIndex: 44, era: "2020", lenses: ["becoming", "unknown"], question: "只有五以内加法，却已经安排好了“首发”。", lead: "功能刚能运行，身份、激活、说明和发布仪式就先被写进了一个小程序。", links: ["real-users", "software-for-whom", "rules-with-exit"], turnLabel: "想象中的顾客，后来真的走进来", turnNote: "界面能运行，不代表别人愿意照着它的规则使用。" },
  { slug: "sauerkraut", title: "我应该向酸菜道歉", sourceIndex: 13, era: "2020—2021", lenses: ["unknown", "becoming"], question: "一盘酸菜，也值得郑重地写出去吗？", lead: "写文章时，我会把普通小事说得很大，也希望屏幕另一边有人看见。", links: ["home-morning", "writer-dashboard", "many-voices"], turnLabel: "从作品的名字回到家里的日常", turnNote: "饭与家人的声音，也能让叙述重新落地。" },
  { slug: "mock-textbook", title: "一本第零版的语文教材", sourceIndex: 18, era: "2021", lenses: ["unknown", "release"], question: "熟悉的权威格式，能不能被拿来开玩笑？", lead: "网络梗被编进目录、注释、课后题和答题卡；我借过学校的格子，也改过它的用途。", links: ["borrowed-time", "rules-with-exit", "many-voices"], turnLabel: "笑话背后，是每天在场的课表", turnNote: "模仿考试格式的认真，也来自被格式安排的时间。" },
  { slug: "dialect-video", title: "山东话真的有这么奇怪吗", sourceIndex: 20, era: "2021", lenses: ["unknown", "becoming"], question: "被看见以后，别人真的听懂了吗？", lead: "一次对家乡口音的回应意外接近一万播放，也带来了陌生人的判断。", links: ["real-users", "writer-dashboard", "many-voices"], turnLabel: "屏幕另一边的人，究竟接住了什么", turnNote: "方言与教程都在碰到被看见、被理解之间的距离。" },
  { slug: "writer-dashboard", title: "给写作者造一块仪表盘", sourceIndex: 21, era: "2021", lenses: ["becoming", "release"], question: "想看清数字，还是更难离开数字？", lead: "编程从写作的麻烦里长出来：阅读、点赞与收益被捞进同一个窗口。", links: ["no-final-score", "software-for-whom", "dialect-video"], turnLabel: "一排数字之外，还能怎样评价自己", turnNote: "把数据集中起来，并不会自动结束对结果的在意。" },
  { slug: "algorithm-exit", title: "我最终退出了算法竞赛", sourceIndex: 54, era: "2024—2025", lenses: ["release"], question: "试过以后，允许自己离开一条看起来厉害的路。", lead: "半年多的尝试没有给出唯一身份，却让我逐渐看清愿意长期处理的那类问题。", links: ["field-questions", "real-users", "proof-and-curiosity"], turnLabel: "从解题速度走向具体领域", turnNote: "退出竞赛后，代码仍然可以接近实际问题。" },
  { slug: "rules-with-exit", title: "我也会设计笨拙的制度", sourceIndex: 64, era: "大学期间", lenses: ["release", "becoming"], question: "如果自己写的规则也会失败，怎么办？", lead: "章程可以拒绝挂靠和臃肿部门，也仍会缺人、延期、留下没写完的方案。", links: ["collective-night", "first-window", "software-for-whom"], turnLabel: "让制度接受共同工作的反问", turnNote: "规则要能被实际参与的人改变。" },
  { slug: "spare-sugar", title: "泰山需要一块备用糖", sourceIndex: 79, era: "大学期间", lenses: ["unknown", "release"], question: "朋友从群聊里走出来以后，关心落在哪里？", lead: "集合时间、路线、体力和一块士力架，让朋友重新成为具体的人。", links: ["missing-dialogue", "collective-night", "home-morning"], turnLabel: "关系并不只有保存下来的对白", turnNote: "确认、等待和回来，也在让关系继续。" },
  { slug: "repository-after-podium", title: "仓库没有在领奖那天冻结", sourceIndex: 122, era: "黑客松之后", lenses: ["release", "becoming"], question: "没有舞台以后，还愿不愿意回来修一点？", lead: "期限统一过队伍，长期维护却需要重新形成共识，也允许项目慢下来。", links: ["collective-night", "archive-seams", "real-users"], turnLabel: "领奖台背后，曾有一个共同的夜晚", turnNote: "回到集成现场，再看散场后留下了什么。" },
  { slug: "home-morning", title: "家里的早晨照常到来", sourceIndex: 124, era: "2026", lenses: ["release", "unknown"], question: "家人不成为作品的时候，也可以只待一会儿。", lead: "旧电影、规则和试题之外，早晨的一局游戏也能让关系继续。", links: ["family-film", "sauerkraut", "sunset"], turnLabel: "让旧电影回到片中人的生活里", turnNote: "保存过的影像，仍要面对家人自己的判断。" }
];

export default definitions.map((definition) => {
  const chapter = chapters.get(definition.sourceIndex);
  let text = clean(chapter.paragraphs.join(""));
  if (definition.slug === "algorithm-exit") {
    const ending = "方向变化不是从代码转向不写代码，而是从证明自己转向理解别人。";
    const boundary = text.indexOf(ending);
    if (boundary < 0) throw new Error("Missing manuscript boundary: algorithm-exit");
    text = text.slice(0, boundary + ending.length);
  }
  if (definition.slug === "machine-registration") {
    const start = text.indexOf("工程文件里仍保留着默认的newapp与模板节点");
    const end = text.indexOf("同一时期还有“玩具世界分数管理”", start);
    if (start >= 0 && end > start) text = text.slice(0, start) + text.slice(end);
  }
  const body = paragraphs(text);
  return { ...definition, narrative: { paragraphs: body, hingeAfter: Math.max(2, Math.floor(body.length * .55)) }, passages: [{ sourceIndex: chapter.sourceIndex, title: clean(chapter.title), page: chapter.bookPage }] };
});
