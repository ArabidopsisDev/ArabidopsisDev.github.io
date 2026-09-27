import fs from "node:fs";
import path from "node:path";
import edition from "../site/_data/rearrangeEdition.js";

const drafts = path.resolve(process.argv[2]);
const output = path.resolve(process.argv[3]);
fs.mkdirSync(output, { recursive: true });
const jobs = [];

for (const scene of edition.scenes) {
  const file = path.join(drafts, `${scene.slug}.json`);
  if (!fs.existsSync(file)) continue;
  if (fs.existsSync(path.join(output, `${scene.slug}.json`))) continue;
  const draft = JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
  const prompt = `请审校下面一段真实回忆录改写。你只能用给出的原书材料核查，不要用一般常识替作者补事实。以 JSON 对象输出：unsupported（数组；每项 quote、reason、safeFix）、broken（数组；句子断裂或段落只剩残字的原文片段）、repetition（数组；明显重复的原文片段）。只报告有明确证据的问题，不作泛泛建议。特别核查是否虚构了具体地点、日期、屏幕动作、对话、别人的感受，或把不同年份的事说成同一天。

原书材料：${JSON.stringify(scene.passages.map((p) => ({ page: p.page, text: p.text })))}
改写：${JSON.stringify(draft.paragraphs)}`;
  const name = `${scene.slug}.txt`;
  fs.writeFileSync(path.join(output, name), prompt, "utf8");
  jobs.push({
    name: scene.slug, promptFile: name,
    system: "你是严格的非虚构事实核查编辑。请仅输出合法 JSON 对象。",
    outputFile: `${scene.slug}.json`, model: "deepseek-flash",
    json: true, maxTokens: 1600,
  });
}
fs.writeFileSync(path.join(output, "jobs.json"), JSON.stringify(jobs, null, 2), "utf8");
console.log(`Prepared ${jobs.length} audits in ${output}`);
