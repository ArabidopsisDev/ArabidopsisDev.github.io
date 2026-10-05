import edition from "./rearrangeEdition.js";
import diary from "./rearrangeDiary.json" with { type: "json" };
import expansion from "./rearrangeExpansion.js";
import readings from "./rearrangeReadings.json" with { type: "json" };
import { layoutAtlas } from "../_lib/atlasLayout.js";

const pageUrl = (slug) => `/stories/rearrange/${slug}/`;
const sceneRoute = (slug, label, note) => ({ slug, href: pageUrl(slug), label, note });

// The poetry is a set of overlapping lenses. A story can belong to several.
// Positions and links express editorial relationships, never a reading order.
const arrangement = {
  "no-final-score": {
    lenses: ["release", "becoming"], x: 36, y: 35,
    routes: [
      sceneRoute("software-for-whom", "想用一个项目证明自己时", "奖学金的失落，怎样进入了软件的新功能。"),
      sceneRoute("collective-night", "把奖项放回共同完成的夜晚", "结果很短，合作的过程很长。"),
      sceneRoute("zero-choice", "一次分数没有替我选完人生", "536 分与提前批，让问题进入另一个现场。")
    ]
  },
  "real-users": {
    lenses: ["unknown", "release", "becoming"], x: 83, y: 17,
    routes: [
      sceneRoute("software-for-whom", "软件到底服务于谁？", "情感识别插件，把旧问题带回正在做的项目。"),
      sceneRoute("field-questions", "从通用功能走向一块具体的田", "领域里谁来填数据，比漂亮的架构更早提出问题。"),
      sceneRoute("first-window", "回到想象中的第一位使用者", "产品口吻曾经比真实顾客更早出现。")
    ]
  },
  "archive-seams": {
    lenses: ["unknown", "release"], x: 15, y: 18,
    routes: [
      sceneRoute("borrowed-time", "没有记录的三年，仍然发生过", "档案偏爱作品，生活未必留下文件。"),
      sceneRoute("missing-dialogue", "有些缺口属于人与人", "没有保存的对白，不等于没有发生的和好。")
    ]
  },
  "first-window": {
    lenses: ["unknown", "release", "becoming"], x: 37, y: 9,
    lead: "屏幕第一次回应输入时，我很兴奋。玩具的条例、小程序的注册和不听话的弟弟，也都在那几年里出现。让一个按钮运行，与让别人愿意使用它，是逐渐碰到的两个问题。",
    routes: [
      sceneRoute("real-users", "当屏幕开始回应别人", "让窗口听话之后，还要面对别人不照流程行动。"),
      sceneRoute("collective-night", "规则遇见共同维护的人", "一个人的秩序，后来需要让别人也能参与。")
    ]
  },
  "many-voices": {
    lenses: ["unknown", "becoming"], x: 59, y: 15,
    routes: [
      sceneRoute("first-window", "让表达进入一个会响应的窗口", "文字、视频与程序，也曾在同一块硬盘里相遇。"),
      sceneRoute("natural-history", "镜头外还有更大的时间", "火箭、演化史、山路与方言，曾同时吸引我。")
    ]
  },
  "borrowed-time": {
    lenses: ["release"], x: 12, y: 46,
    routes: [
      sceneRoute("zero-choice", "离开固定课表以后", "进入陌生专业，自由仍要从日常里慢慢寻找。"),
      sceneRoute("many-voices", "时间突然松开时，我做了很多视频", "假期没有把生活自动变成一条规划好的路线。")
    ]
  },
  "zero-choice": {
    lenses: ["unknown", "becoming"], x: 47, y: 63, era: "2024 以后",
    lead: "536 分，提前批，种子科学与工程。偶然走进的专业，后来变成了需要认真理解的知识与现场。",
    routes: [
      sceneRoute("field-questions", "让专业从名称变成现场", "种子、区组、小区，后来进入身体和代码。"),
      sceneRoute("no-final-score", "重新看分数怎样影响选择", "幸运不必被写成注定，失利也没有最后裁决。")
    ]
  },
  "natural-history": {
    lenses: ["unknown", "becoming"], x: 17, y: 78,
    routes: [
      sceneRoute("field-questions", "从演化史走到田里", "喜欢辽阔的自然，也需要面对具体知识与劳动。"),
      sceneRoute("many-voices", "给好奇心换一种声音", "文字、视频和游戏都是可能的入口。")
    ]
  },
  "field-questions": {
    lenses: ["unknown", "becoming"], x: 39, y: 88,
    routes: [
      sceneRoute("real-users", "让模型接受使用者的反问", "田间概念写成字段以后，还要有人真正记录。"),
      sceneRoute("natural-history", "为什么愿意继续靠近农学", "劳累与好奇同时存在。")
    ]
  },
  "collective-night": {
    lenses: ["release", "becoming"], x: 85, y: 55,
    routes: [
      sceneRoute("missing-dialogue", "合作之前，也有过裂隙", "项目不能替关系补造一个完美开头。"),
      sceneRoute("archive-seams", "仓库留下了什么", "提交能保存协作动作，无法记录生活的全部。")
    ]
  },
  "missing-dialogue": {
    lenses: ["release"], x: 78, y: 78,
    routes: [
      sceneRoute("collective-night", "恢复联系以后，一起做一件事", "不必先把过去修成完整，才允许新的共同经历发生。"),
      sceneRoute("archive-seams", "让那句找不到的话保持缺失", "证据有接缝，记忆也有。")
    ]
  },
  "sunset": {
    lenses: ["unknown", "release", "becoming"], x: 63, y: 92,
    lead: "书稿暂时写完，问题还在。家人、植物、朋友与日落继续存在，未来仍会让旧的问题有新的变化。",
    routes: [
      sceneRoute("archive-seams", "带着不完整的记忆继续走", "整理过的东西，也还可以重新打开。"),
      sceneRoute("natural-history", "再看一次更大的世界", "好奇心可以继续，不必先获得一个完成的身份。")
    ]
  }
};

const encounters = Object.entries(arrangement).map(([slug, config]) => {
  const original = edition.sceneBySlug[slug];
  if (!original) throw new Error("Missing manuscript scene: " + slug);
  return { ...original, ...config, narrative: { ...original.narrative, paragraphs: [...original.narrative.paragraphs] }, turn: config.routes[0] };
});
for (const chapter of expansion) {
  const routes = chapter.links.map((slug, index) => sceneRoute(slug, index === 0 ? chapter.turnLabel : "再看一段相连的经历", index === 0 ? chapter.turnNote : ""));
  encounters.push({ ...chapter, kind: "memoir", movement: chapter.lenses[0], movementInfo: edition.movementById[chapter.lenses[0]], routes, turn: routes[0] });
}
for (const excerpt of diary.episodes) {
  const routes = excerpt.connections.map((link) => sceneRoute(link.to, link.label, link.note));
  encounters.push({
    ...excerpt, movement: "release", movementInfo: edition.movementById.release,
    era: excerpt.date, question: excerpt.intro, lead: "依据这一周相关日记与书稿材料，重新串联的后续经历。", kind: "diary",
    x: 66, y: 39, routes, turn: routes[0], passages: [],
    narrative: { paragraphs: [...excerpt.paragraphs], hingeAfter: Math.floor(excerpt.paragraphs.length / 2) }
  });
}
const bySlug = Object.fromEntries(encounters.map((scene) => [scene.slug, scene]));
const retired = {
  "toy-constitution": "first-window",
  "let-it-remain-open": "archive-seams",
  "strange-major": "zero-choice"
};
for (const [from, into] of Object.entries(retired)) {
  const merged = [...bySlug[into].passages, ...edition.sceneBySlug[from].passages];
  bySlug[into].passages = [...new Map(merged.map((passage) => [passage.sourceIndex, passage])).values()];
}

// A shared opening about proof is more useful here than two parallel essays
// about programs and toy government.
bySlug["first-window"].narrative = {
  hingeAfter: 4,
  paragraphs: [
    "最早让我高兴的，是按一下以后，屏幕真的有了反应。猜数字只是随机取数再比较，等级换算也不过几条条件判断；现在回头看，代码薄得几乎没什么可讲。可那时我第一次发现，电脑不只陈列别人做好的游戏和软件，也允许我自己挪动一个很小的按钮。",
    "易语言窗口真正亮起来时，我激动得浑身发抖。今天再看可以挑出许多毛病：界面粗糙，逻辑挤在事件里，文件四处放；当时我并不知道怎样评价这些。我知道的只是，输入会被接住，程序会按照写下的规则运行。那种兴奋比后来一个版本号或商品名称更早。",
    "规则在程序之前已经出现在家里。六年级时，我喜欢给玩具分身份，给兄弟之间的游戏写条例。2020 年留下的四份文件甚至讨论“全敌对”和“半封锁”，编号却把 0004 写成了 0003。现实不过是两个孩子闹别扭，进了 Word 就像外交危机。如今觉得好笑，当时写公文、做积分表和做一个会响应的窗口，却确实是并排发生的事。",
    "我总想再加一层格式：玩具属于谁，今天发生了什么，明天该守哪条规则。后来窗口会让使用者填写姓名、使用电脑的理由和序列号，一个小程序也会有注册、价格和说明书。它们未必真有顾客，产品的口吻已经先学会了。能安排一个界面，很容易让人误以为也能安排界面另一边的人。",
    "弟弟当然不照条例生活。他会顶嘴，会改乱我的桌面；后来我问代码，他还回答“这是一个下等的问题”。那些玩具世界里的夸张名称属于游戏，不该被今天的回忆写成真实刑罚。他是和我一起长大的人，不能因为我的文档保存得多，就只剩下一个被管理的角色。",
    "学习程序本身也没有照着说明书一直成功。《数绵羊机器》会漏掉最后一只羊，Python 练习里有嵌套错乱的列表和不对的变量名。我先让东西跑起来，再发现它为什么不可靠；把当前文件传到网上以后，才慢慢知道有些东西并不该进仓库。提交留下的，是确实试到了这里，也留下了不会的部分。",
    "这些尝试没有单独占有那几年。网课资料、家庭录像、玩具、脚本和 PPT 共享一块硬盘：视频可以被批处理搬进剪辑目录，物理公式可以被改成机器朗读的句子，弟弟的积分也可以变成窗口。我很难再把它们排成先生活、后技术的路线，只能承认当年就是这样东试一下、西试一下。",
    "窗口运行时的兴奋可以留在那里。至于别人如何使用我写的东西、是否需要那一层规则，还要在真正的反馈里继续学。第一扇窗口打开的地方很小，外面仍有许多我不知道的事。"
  ]
};

bySlug["zero-choice"].narrative = {
  hingeAfter: 5,
  paragraphs: [
    "查高考成绩以前，我给自己设了 525 分的心理门槛，在群里说如果能过就现场磕几个。那是估分，并不是实际成绩。等待时嘴上说不谈高考了，话题又不断绕回复读和专业；真正查到的是 536 分。数字终于确定下来，下一步却没有跟着变得确定。",
    "我点开康复治疗、智能医学、护理等陌生专业的往年分数。看见一些页面落在五百一二十分附近，仍觉得够呛；谈到计算机，又说自己只能报专科，朋友便顺着玩笑把我安排成“计算机硕士”。这些话很像当时的状态：能说清的只有一个分数，不知道要把它带到哪里。",
    "有人提到提前批，我才第一次认真看见种子科学与工程。此前并没有多少系统的农学知识，更谈不上从小就计划好这条路。植物、遗传、育种和真实土地带来的兴趣，让我把山东农业大学种子科学与工程（新农科实验班）填了上去。它像一个偶然出现的入口，而我愿意先走进去。",
    "后来复盘普通批志愿，发现前面的几个目标都差三分左右；如果没有这次提前批，我很可能一路滑到曲阜师范大学。这让选择显得幸运，却不能被倒写成命中注定。录取解决了去哪里上学，没有替我决定要怎样理解专业，也没有要求从前的编程、影像和其他兴趣立刻退出。",
    "进校以后，喜欢探索世界与适应培养制度的区别很快出现。课表、早八、签到、部门和临时通知都很具体，高中式的内耗也没有在大学门口停下。化学和高数照样让人发呆，平时没背的书还会在考试前翻回来。所谓换了一种身份，并没有让每天的生活自动变自由。",
    "我先用熟悉的方法接近陌生环境。专业可以被写进表演、排版和程序，宿舍、食堂、生日桌与考试又不断把想象拉回日常。植物学实验里的花程式，与写代码时的命名不是同一套知识，却都需要我重新学。最初那点兴趣，只能在这样的具体经验里慢慢检验。",
    "农学没有变成理想国，背诵、劳动、形式化活动和就业焦虑仍在。可一粒种子既有基因，也受到土地、气候与人的选择影响；农业数据、QTL、生物信息学又把不同尺度接了起来。能继续靠近它，不是因为问题都消失了，而是有些问题确实值得学下去。",
    "专业教育已经改变了我看植物、土地和实验的方式，这种改变不必完全依赖未来的毕业岗位。原来的编程兴趣仍在，新的知识也需要认真学；它们能怎样接到一起，要留给后来的经验回答。",
    "第零志愿留下的不是一份选择正确的证明。偶然把我带来，是否继续则要由之后的学习和生活回答。走进田里时、让田块进入数据结构时，答案都会再变一点。我可以带着旧兴趣留下，也可以承认仍有许多不会的东西。"
  ]
};

// Remove the copied closing refrain from an unrelated episode.
const natural = bySlug["natural-history"].narrative.paragraphs;
natural[natural.length - 1] = "农学把向往变得更麻烦，也变得更具体。我仍不知道最后会走向哪个方向；看过演化史、保存过航天消息、愿意在山路上停下，都不能替我学会一门专业。它们只让我知道，在课程和评价之外，好奇心曾经出现过，也还可以继续出现。下一次走到田里，就让这些向往接受泥土、天气和实际问题的检验。";

for (const scene of encounters) {
  scene.readings = readings[scene.slug] || [{ label: "当前回看", asOf: "2026-10-05", lenses: [...scene.lenses] }];
  scene.currentReading = scene.readings.at(-1);
  scene.lenses = [...scene.currentReading.lenses];
  scene.movement = scene.lenses[0];
  scene.movementInfo = edition.movementById[scene.movement];
  scene.readings = scene.readings.map((reading) => ({ ...reading, lensNames: reading.lenses.map((id) => edition.movementById[id].title) }));
}
bySlug["collective-night"].era = "2026 年黑客松";
const world = layoutAtlas(encounters);
for (const scene of encounters) Object.assign(scene, world.positions[scene.slug]);
const mapNodes = encounters.map((scene) => ({ ...scene, href: pageUrl(scene.slug), kind: scene.kind || "memoir" }));
const mapById = Object.fromEntries(mapNodes.map((node) => [node.slug, node]));
const edgeIds = new Set();
const edges = [];
for (const node of mapNodes) {
  for (const route of node.routes || []) {
    const other = mapById[route.slug];
    const id = [node.slug, route.slug].sort().join("|");
    if (!other || edgeIds.has(id)) continue;
    edgeIds.add(id);
    edges.push({ from: node.slug, to: other.slug, x1: node.x, y1: node.y, x2: other.x, y2: other.y });
  }
}
for (const scene of encounters) {
  scene.routes = scene.routes.map((route) => {
    const destination = mapById[route.slug];
    if (!destination) throw new Error("Missing story route: " + scene.slug + " -> " + route.slug);
    return { ...route, title: destination.title, label: route.label === "再看一段相连的经历" ? destination.title : route.label, note: route.note || destination.question, kind: destination.kind, range: destination.era };
  });
  scene.turn = scene.routes[0];
}
const lenses = edition.movements.map((movement) => ({
  ...movement,
  count: encounters.filter((scene) => scene.lenses.includes(movement.id)).length
}));
const releaseNodes = encounters.filter((scene) => scene.lenses[0] === "release");
const initialNodes = releaseNodes.length ? releaseNodes : encounters;
const initialView = { x: initialNodes.reduce((sum, node) => sum + node.x, 0) / initialNodes.length, y: initialNodes.reduce((sum, node) => sum + node.y, 0) / initialNodes.length };

export default { encounters, bySlug, retired, lenses, mapNodes, edges, ids: mapNodes.map((node) => node.slug), world, initialView, initialFocus: diary.episodes.at(-1)?.slug || encounters[0].slug, bookCount: encounters.filter((node) => node.kind !== "diary").length, diaryCount: diary.episodes.length };
