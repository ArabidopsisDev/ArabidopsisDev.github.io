import fs from "node:fs";
import path from "node:path";
import edition from "../site/_data/rearrangeEdition.js";
import examples from "../site/_data/rearrangeNarratives.json" with { type: "json" };

const destination = path.resolve(process.argv[2] || ".scratch/rearrange-continuity");
const only = process.argv[3];
fs.mkdirSync(destination, { recursive: true });
const sample = examples["archive-seams"].paragraphs;
const jobs = [];

for (const scene of edition.scenes) {
  if (examples[scene.slug] || (only && scene.slug !== only) || fs.existsSync(path.join(destination, `${scene.slug}.json`))) continue;
  const material = {
    movement: scene.movementInfo.title,
    title: scene.title,
    question: scene.question,
    opening: scene.lead,
    crossing: scene.crossing.note,
    source: scene.passages.map((passage) => ({ page: passage.page, text: passage.text })),
  };
  const prompt = `请为“把世界重新编排”回忆录写出一个新的连续场景。以 JSON 对象回复，字段严格为 paragraphs（恰好 8 个自然段字符串）和 hingeAfter（3—5 的整数）。

每段约 130—190 个汉字，总正文约 1200—1600 汉字。以第一份材料里的具体事件/物件为主轴，后面的材料只在叙事需要时进入，并改变读者对主轴的理解。先让事件发生，再暴露矛盾，经过一次具体的认知转折，最后留下能通向下一幕的问题。hingeAfter 放在真正的转折后；crossing 是转向另一幕的线索，正文不要写“点击”“选择”之类网站文案。

不要保留原网页的四段标题或按来源顺序逐段概括。允许重写句子、压缩和重排，避免连续照搬来源 30 个字以上；但绝不新增材料里没有的人物行动、日期、数字、台词或心理动机。对原书说不清的事情，直接保留不确定。不要写鸡汤、章节总结，也不要每段结尾都解释意义。语言要像一个人认真回忆，有具体细节和少量自嘲，读起来像完整的散文。

以下两段只作为叙事节奏示例，不能照用其中事实或句子：
${sample[0]}
${sample[7]}

待编排的场景材料：${JSON.stringify(material)}`;
  const file = `${scene.slug}.txt`;
  fs.writeFileSync(path.join(destination, file), prompt, "utf8");
  jobs.push({
    name: scene.slug, promptFile: file,
    system: "你是中文非虚构回忆录编辑。请仅输出合法 JSON 对象，并严格保持事实来源可追溯。",
    outputFile: `${scene.slug}.json`,
    model: "deepseek-flash", json: true, maxTokens: 2600,
  });
}
fs.writeFileSync(path.join(destination, "jobs.json"), JSON.stringify(jobs, null, 2), "utf8");
console.log(`Prepared ${jobs.length} continuity tasks in ${destination}`);
