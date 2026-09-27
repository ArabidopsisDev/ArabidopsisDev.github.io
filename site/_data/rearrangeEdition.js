import source from "./rearrangeContent.json" with { type: "json" };
import narratives from "./rearrangeNarratives.json" with { type: "json" };
import narrativeOverrides from "./rearrangeNarrativeOverrides.js";

const byIndex = new Map(Object.values(source).flat().map((chapter) => [chapter.sourceIndex, chapter]));

// The PDF extraction occasionally inserts spaces inside dates and English names.
// These selected passages are Chinese prose, where removing those spaces restores
// the printed text without changing the author's words.
const tidy = (value) => value.replace(/\s+/gu, "").replace(/(?<=。)0$/u, "");
const complete = (value) => /[。！？][”’」』）】]?$/u.test(value)
  && (value.match(/“/gu) || []).length <= (value.match(/”/gu) || []).length;

const movements = [
  {
    id: "unknown", number: "I", title: "走向未知", english: "THE WAY OF IGNORANCE",
    quote: "为了抵达你所不知道的地方，你必须走一条通往无知的路。",
    description: "旧硬盘、第一扇窗口、考场和农田。知道得越多，越能看见证据与经验之间的空白。",
    color: "#b8c7ff", symbol: "✦", start: "archive-seams",
  },
  {
    id: "release", number: "II", title: "练习放手", english: "THE WAY OF DISPOSSESSION",
    quote: "为了拥有你未曾拥有的东西，你必须走一条放弃拥有之路。",
    description: "规则、时间、成绩和关系。放下掌控的幻觉之后，人与作品才有继续生长的空间。",
    color: "#f1c39b", symbol: "◌", start: "toy-constitution",
  },
  {
    id: "becoming", number: "III", title: "成为尚未成为的我", english: "THE WAY IN WHICH YOU ARE NOT",
    quote: "为了抵达你目前未抵达的地方，你必须走一条你目前未曾走过之路。",
    description: "视频、陌生专业、真实用户和共同完成的项目。身份不是答案，而是在行动里渐渐改变的东西。",
    color: "#a5e4d6", symbol: "✧", start: "many-voices",
  },
];

const scenes = [
  { slug: "archive-seams", movement: "unknown", number: "01", title: "硬盘没有年表", question: "文件的日期，能证明哪一种过去？", era: "2017—2026",
    lead: "整理旧电脑时，我以为自己会找到一条从童年走向今天的直线。文件夹、照片和提交记录却给出好几种互相冲突的时间。故事从这条接缝开始。",
    beats: [[1,0,"打开旧硬盘"],[95,0,"镜头里是谁"],[6,1,"日期为何会说谎"],[125,0,"保留不知道"]],
    crossing: { after: 2, to: "collective-night", label: "同一份仓库，换一个问题", note: "比赛结束后，记录为什么仍在继续？" }, next: "first-window" },
  { slug: "first-window", movement: "unknown", number: "02", title: "第一扇窗口", question: "当屏幕第一次听话，我究竟发现了什么？", era: "2018—2020",
    lead: "从纸面条例、论坛脚本到易语言窗口，我最初迷恋的是“按一下，世界会变化”。那时技术很浅，想造一个世界的冲动却已经很强。",
    beats: [[2,0,"屏幕不只是橱窗"],[3,1,"先给玩具制定规则"],[10,0,"窗口亮起的一刻"],[8,0,"笨拙的 Python 练习"]],
    crossing: { after: 2, to: "toy-constitution", label: "进入放手线", note: "创造规则的快乐，后来怎样变成控制的负担？" }, next: "natural-history" },
  { slug: "natural-history", movement: "unknown", number: "03", title: "演化史让我想哭", question: "专业选择之前，世界怎样吸引了我？", era: "2020—2024",
    lead: "电脑并不是唯一的入口。航天、山路、生物演化和游戏世界早已混在硬盘里；后来进入农学，不是突然换了一个人。",
    beats: [[36,0,"更长的时间尺度"],[104,0,"那些不是旁枝的兴趣"],[105,1,"自然并未迟到"],[62,0,"想探索世界"]],
    crossing: { after: 2, to: "many-voices", label: "进入成为线", note: "同一份好奇心，为什么又走向视频和文字？" }, next: "zero-choice" },
  { slug: "zero-choice", movement: "unknown", number: "04", title: "第零志愿", question: "一个意外的入口，能不能成为主动的选择？", era: "2022—2023",
    lead: "考试结束并没有送来完整答案。分数、提前批、陌生专业与家人的生活同时抵达。我先走进去，再慢慢弄明白自己为何留下。",
    beats: [[24,2,"平淡的考试终点"],[38,0,"录取通知之外"],[53,0,"第一次进入农田"],[62,2,"选择不是宣言"]],
    crossing: { after: 2, to: "no-final-score", label: "进入放手线", note: "如果分数不再解释一切，失败该如何被阅读？" }, next: "field-questions" },
  { slug: "field-questions", movement: "unknown", number: "05", title: "田块提出的问题", question: "课本概念碰到泥土，会发生什么？", era: "2023—2025",
    lead: "下地、观察、写田间试验工具 Citation 的领域模型，原来是同一条探索路径。田间工作没有自动变得浪漫；它让抽象规则第一次接受现场的反问。",
    beats: [[61,0,"周六考试，周日下地"],[65,0,"田块进入数据结构"],[70,1,"实践与技术并排"],[74,0,"现场改变架构"]],
    crossing: { after: 2, to: "real-users", label: "进入成为线", note: "从土地的边界，走向真实使用者的边界。" }, next: "toy-constitution" },

  { slug: "toy-constitution", movement: "release", number: "06", title: "玩具世界的宪法", question: "为什么我总想先写好所有规则？", era: "2017—2021",
    lead: "给玩具建立政府、给工作室列部门、给不存在的顾客开商城。这些事既滑稽又认真：规则让我获得秩序，也让我误以为秩序可以代替人。",
    beats: [[3,0,"中央政府成立"],[39,0,"六年级的制度"],[41,1,"成员尚未出现"],[45,0,"请说明使用电脑的原因"]],
    crossing: { after: 2, to: "first-window", label: "回到未知线", note: "这些规则最早如何从屏幕里生长？" }, next: "borrowed-time" },
  { slug: "borrowed-time", movement: "release", number: "07", title: "被占满的时间", question: "当时间不由自己安排，还能留下什么？", era: "2020—2022",
    lead: "六点到校，十点半放学，两周只放半天假。高中在仓库里显得安静，却不是一段空白。Aim 这个反复重做的程序，只占了生活的一小部分。",
    beats: [[33,0,"每天的边界"],[49,0,"硬盘里安静的三年"],[50,0,"假期仍在搭世界"],[100,1,"沉默不是缺席"]],
    crossing: { after: 2, to: "strange-major", label: "进入成为线", note: "离开固定课表以后，自由为什么没有自动出现？" }, next: "no-final-score" },
  { slug: "no-final-score", movement: "release", number: "08", title: "没有终局的评分", question: "失败和奖牌，能否同时放回生活？", era: "2023—2026",
    lead: "院赛没有通过，算法竞赛退出，田间试验工具 Citation 也并不完善；后来又第一次站上领奖台。结果都是真的，但没有一张评分表能解释全部生活。",
    beats: [[57,0,"院赛没有通过"],[54,1,"退出也是决定"],[84,0,"站上领奖台"],[92,0,"并没有战胜优绩主义"]],
    crossing: { after: 2, to: "zero-choice", label: "回到未知线", note: "分数曾把我带进怎样一个陌生现场？" }, next: "missing-dialogue" },
  { slug: "missing-dialogue", movement: "release", number: "09", title: "没有留下的和好对白", question: "关系能不能不靠完整证据成立？", era: "2021—2025",
    lead: "档案里有截图、群聊和项目记录，偏偏没有最想找的那句和好对白。书中的 Zopiclone 等名字是朋友在网络上留下的称呼；关系无法像文件那样归档。",
    beats: [[37,0,"被屏蔽的一句话"],[78,0,"没有留下的对白"],[86,1,"仍然记得"],[109,0,"朋友不是项目资源"]],
    crossing: { after: 2, to: "collective-night", label: "进入成为线", note: "关系恢复以后，怎样走进一次真实协作？" }, next: "let-it-remain-open" },
  { slug: "let-it-remain-open", movement: "release", number: "10", title: "给未完成留位置", question: "失去完整性后，还要不要继续做？", era: "2018—2026",
    lead: "网站误删、工程重开、旧域名易主。所谓拥有，从来不是把一个版本永远锁住。我开始学着把缺口、失败和继续维护放在同一页。",
    beats: [[42,0,"补不回来的站点"],[91,0,"旧工程重新打开"],[114,0,"生活不会自动存档"],[118,0,"真正要保留的动作"]],
    crossing: { after: 2, to: "archive-seams", label: "回到未知线", note: "回看硬盘，确认哪些东西真的还在。" }, next: "many-voices" },

  { slug: "many-voices", movement: "becoming", number: "11", title: "试遍许多种声音", question: "写作、影像和程序，哪一种才算我？", era: "2020—2024",
    lead: "年度 PPT、七十五条视频、方言、伪教材与编程教程曾同时发生。试错的媒介并不互相排斥；每一种都替我说出另一种说不出的东西。",
    beats: [[12,0,"同一本 PPT"],[17,0,"七十五条视频"],[19,0,"让机器念物理公式"],[111,0,"媒介不断换手"]],
    crossing: { after: 2, to: "natural-history", label: "回到未知线", note: "好奇心如何先在自然和航天里出现？" }, next: "strange-major" },
  { slug: "strange-major", movement: "becoming", number: "12", title: "先把陌生专业演出来", question: "还不属于这里时，怎样试着属于这里？", era: "2022—2024",
    lead: "进入农学以后，我曾用旧的表达方法接近新环境：演讲、排版、程序和想象中的产品。扮演不是欺骗；它有时是抵达理解以前的一种练习。",
    beats: [[55,0,"大学没有自动自由"],[59,0,"先演出一个身份"],[60,0,"生日桌与宿舍"],[62,1,"探索比背诵更重要"]],
    crossing: { after: 2, to: "borrowed-time", label: "进入放手线", note: "陌生的自由背后，是怎样被占满的三年？" }, next: "real-users" },
  { slug: "real-users", movement: "becoming", number: "13", title: "真实使用者走进来", question: "作品离开电脑后，谁来改写它？", era: "2023—2026",
    lead: "从给不存在的顾客设计页面，到朋友指出具体错误，产品的主语变了。使用者不会照我的流程行动；这正是作品开始成长的地方。",
    beats: [[25,0,"想象中的顾客"],[58,0,"从评委转向使用者"],[66,0,"复习工具长出原型"],[107,0,"反馈开始塑造作者"]],
    crossing: { after: 2, to: "field-questions", label: "回到未知线", note: "一个真实领域如何拆掉通用方案？" }, next: "collective-night" },
  { slug: "collective-night", movement: "becoming", number: "14", title: "凌晨四点十分", question: "一个人的野心，怎样成为许多人的工作？", era: "2024—2025",
    lead: "朋友们从不同城市抵达，一起完成 GalReview 的集成测试。出发前夜、领奖台和之后仍在移动的仓库连在一起；高潮不只发生在宣布奖项的一刻。",
    beats: [[76,0,"真实旧系统进入团队"],[83,0,"集成测试开始"],[84,1,"领奖一刻"],[87,0,"仓库继续移动"]],
    crossing: { after: 2, to: "missing-dialogue", label: "进入放手线", note: "这种协作之前，关系经历过哪些裂隙？" }, next: "sunset" },
  { slug: "sunset", movement: "becoming", number: "15", title: "潮水到来以前", question: "如果故事还没有答案，能不能继续生活？", era: "2026 以后",
    lead: "这不是通关结局。书稿写完，旧问题依然存在；风、植物、家人、朋友和日落也仍在。重新编排世界的意思，也许只是看清下一次行动从哪里开始。",
    beats: [[116,0,"没有唯一答案"],[118,1,"保留动作"],[127,0,"风吹进房间"],[128,0,"别错过日落"]],
    crossing: { after: 2, to: "archive-seams", label: "从头再问一次", note: "十年之后，旧硬盘会讲出另一种故事。" }, next: "archive-seams" },
];

const movementById = Object.fromEntries(movements.map((movement) => [movement.id, movement]));
const sceneBySlug = Object.fromEntries(scenes.map((scene) => [scene.slug, scene]));

for (const scene of scenes) {
  scene.movementInfo = movementById[scene.movement];
  scene.narrative = narrativeOverrides[scene.slug] || narratives[scene.slug];
  if (!scene.narrative || !Array.isArray(scene.narrative.paragraphs)
      || scene.narrative.paragraphs.length < 6
      || scene.narrative.hingeAfter < 2
      || scene.narrative.hingeAfter >= scene.narrative.paragraphs.length) {
    throw new Error(`Missing continuous narrative for ${scene.slug}`);
  }
  scene.passages = scene.beats.map(([sourceIndex, paragraphIndex, heading]) => {
    const chapter = byIndex.get(sourceIndex);
    if (!chapter?.paragraphs[paragraphIndex]) throw new Error(`Missing passage ${sourceIndex}:${paragraphIndex}`);
    const paragraphs = [tidy(chapter.paragraphs[paragraphIndex])];
    for (let index = paragraphIndex + 1; index < Math.min(chapter.paragraphs.length, paragraphIndex + 3) && !complete(paragraphs.join("")); index++) {
      paragraphs.push(tidy(chapter.paragraphs[index]));
    }
    return { heading, paragraphs, text: paragraphs.join(""), sourceIndex, title: tidy(chapter.title), page: chapter.bookPage };
  });
  if (scene.passages.reduce((sum, passage) => sum + passage.text.length, 0) < 1300) {
    const [sourceIndex, paragraphIndex] = scene.beats[0];
    const chapter = byIndex.get(sourceIndex);
    const paragraphs = [tidy(chapter.paragraphs[paragraphIndex]), tidy(chapter.paragraphs[paragraphIndex + 1])];
    for (let index = paragraphIndex + 2; index < chapter.paragraphs.length && !complete(paragraphs.join("")); index++) {
      paragraphs.push(tidy(chapter.paragraphs[index]));
    }
    scene.passages[0].paragraphs = paragraphs;
    scene.passages[0].text = paragraphs.join("");
  }
  scene.nextTitle = sceneBySlug[scene.next]?.title;
  scene.crossTitle = sceneBySlug[scene.crossing.to]?.title;
  if (!scene.nextTitle || !scene.crossTitle) throw new Error(`Missing route for ${scene.slug}`);
}

export default { movements, scenes, sceneBySlug, movementById, total: scenes.length };
