import fs from "node:fs";
import path from "node:path";
import edition from "../site/_data/rearrangeEdition.js";
import source from "../site/_data/rearrangeContent.json" with { type: "json" };

const destination = path.resolve(process.argv[2] || ".scratch/rearrange-redraft");
fs.mkdirSync(destination, { recursive: true });
const byIndex = new Map(Object.values(source).flat().map((chapter) => [chapter.sourceIndex, chapter]));
const jobs = [];

for (const scene of edition.scenes) {
  const chapters = [...new Set(scene.beats.map(([index]) => index))].map((index) => {
    const chapter = byIndex.get(index);
    return {
      page: chapter.bookPage,
      title: chapter.title,
      text: chapter.paragraphs.join("").replace(/\s+/gu, ""),
    };
  });
  const input = {
    scene: scene.slug,
    movement: scene.movementInfo.title,
    title: scene.title,
    question: scene.question,
    premise: scene.lead,
    currentBeats: scene.beats.map(([, , heading]) => heading),
    crossing: scene.crossing.note,
    chapters,
  };
  const prompt = `请用 JSON 返回一个对象，含 paragraphs（7—10 个自然段字符串）和 hingeAfter（整数，3—6，表示在哪一段后出现另一条线索）。

目标：把下面的回忆录材料重写为一个有起因、转折与余波的连续第一人称场景，约 1300—1700 个汉字。把第一个来源中的具体物件或现场作为叙事轴心，让其他来源的信息在需要时自然进入，最后回到轴心或留下一个具体问题。每段都要推动情节、认知或关系；不要按来源顺序做四段摘要，不要沿用“章节标题＋摘录”的拼贴形式。

保持作者原书的具体、偶尔自嘲但审慎的口吻。可以压缩、转接、轻改原文，但不能编造事件、数字、日期、作品、对白、动机或他人感受。原书明确说“不知道”的地方必须保留不确定性。避免空泛的励志结论、反复的“不是……而是……”句式和对人生的过度解释。直接引语只能逐字来自材料。若材料不足以支持自然衔接，用坦率的叙述过渡，不填造事实。

在 hingeAfter 指定的位置，正文应自然生出给定 crossing 问题，但正文不要出现链接提示或“选择下一条线”一类 UI 文案。正文不加标题、编号、来源页码或注释。

材料：${JSON.stringify(input)}`;
  const file = `${scene.slug}.txt`;
  fs.writeFileSync(path.join(destination, file), prompt, "utf8");
  jobs.push({
    name: scene.slug,
    promptFile: file,
    system: "你是认真处理非虚构回忆录的中文编辑。请仅输出合法 JSON 对象，忠于提供的原书材料。",
    outputFile: `${scene.slug}.json`,
    model: "deepseek-flash",
    json: true,
    maxTokens: 3500,
  });
}

fs.writeFileSync(path.join(destination, "jobs.json"), JSON.stringify(jobs, null, 2), "utf8");
console.log(`Prepared ${jobs.length} scenes in ${destination}`);
