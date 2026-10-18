/**
 * 题目块渲染校验。
 *
 *   node tools/check-question-blocks.mjs
 *
 * 直接复用站点真实的 markdown-it 流水线（eleventy.config.js#createMarkdown），
 * 覆盖选择题、解答题、属性、两种写法、公式、代码围栏误伤与编辑器行号锚点。
 */
import { createMarkdown } from "../eleventy.config.js";

const md = createMarkdown();
const failures = [];
const checks = [];

function check(name, condition, detail = "") {
  checks.push(name);
  if (!condition) failures.push(`${name}${detail ? `：${detail}` : ""}`);
}

function render(source) {
  return md.render(source).replace(/\n\s*/gu, "");
}

// 1. 选择题：题干 + 四个选项 + 公式
const choice = render([
  "::: question 3",
  "已知 $f(x)=x^2+1$，则 $f(2)$ 等于：",
  "",
  "- A. $3$",
  "- B. $4$",
  "- C. $5$",
  "- D. $6$",
  ":::",
].join("\n"));
check("选择题生成 question-block--choice", choice.includes('class="question-block question-block--choice"'));
check("选择题徽标为“选择题”", choice.includes('<span class="question-block-label">选择题</span>'));
check("选择题题号为“第 3 题”", choice.includes('<span class="question-block-number">第 3 题</span>'));
check("选择题渲染四列选项", (choice.match(/class="question-block-option"/gu) || []).length === 4);
check("选项标号为 A–D", ["A", "B", "C", "D"].every((letter) => choice.includes(`<span class="question-block-option-label">${letter}</span>`)));
check("选项内的行内公式交给 KaTeX", (choice.match(/class="katex"/gu) || []).length >= 5);
check("题干公式交给 KaTeX", choice.includes("katex"));
check("figure 带题型属性", choice.includes('data-question-type="choice"'));

// 2. 解答题：只有题干
const answer = render([
  "::: question",
  "计算 $w(\\text{NaCl})=10\\%$ 的氯化钠水溶液中溶质的摩尔分数。",
  "",
  "$$x(\\text{NaCl})=\\frac{n(\\text{NaCl})}{n(\\text{NaCl})+n(\\text{H}_2\\text{O})}$$",
  ":::",
].join("\n"));
check("解答题生成 question-block--answer", answer.includes("question-block--answer"));
check("解答题徽标为“解答题”", answer.includes('<span class="question-block-label">解答题</span>'));
check("解答题不输出选项列表", !answer.includes("question-block-options"));
check("解答题保留独立公式", answer.includes("katex-display"));

// 3. 显式 type=answer 时尾部列表仍然属于题干
const stemList = render([
  "::: question type=answer",
  "判断下列说法：",
  "",
  "1. 溶液凝固点下降与溶质粒子数有关",
  "2. 沸点升高与凝固点下降同源",
  ":::",
].join("\n"));
check("type=answer 不解析尾部列表", !stemList.includes("question-block-options") && stemList.includes("<ol"));

// 4. 中文属性、答案解析、徽标替换
const labelled = render([
  "::: question 例题 2 类型=解答题 答案=B",
  "某碳氢化合物碳、氢原子数相等，确定其分子式。",
  ":::",
].join("\n"));
check("位置写法可作徽标", labelled.includes('<span class="question-block-label">例题</span>'));
check("自定义徽标自带计数单位", labelled.includes('<span class="question-block-number">2</span>'));
check("中文键 type 生效", labelled.includes("question-block--answer"));
check("答案渲染在标题行", labelled.includes('<span class="question-block-answer">答案 <b>B</b></span>'));

// 4b. 只写前缀时按前缀自动编号，例题与题目各排各的
const numbering = render([
  "::: question 例题",
  "例一",
  ":::",
  "",
  "::: question 例题",
  "例二",
  ":::",
  "",
  "::: question 题目",
  "题一",
  ":::",
  "",
  "::: question 题目",
  "题二",
  ":::",
].join("\n"));
const titles = [...numbering.matchAll(/<span class="question-block-title">([\s\S]*?)<\/span><\/div>/gu)]
  .map((match) => match[1].replace(/<[^>]*>/gu, " ").replace(/\s+/gu, " ").trim());
check("前缀自动编号各自独立", JSON.stringify(titles) === JSON.stringify(["例题 1", "例题 2", "题目 1", "题目 2"]), JSON.stringify(titles));

const labeledByKey = (label) => {
  const html = render([`::: question 前缀=${label}`, "题干", ":::", "", `::: question 前缀=${label}`, "题干", ":::"].join("\n"));
  return [...html.matchAll(/<span class="question-block-number">([^<]*)<\/span>/gu)].map((match) => match[1]);
};
check("prefix 键同样参与计数", JSON.stringify(labeledByKey("练习")) === JSON.stringify(["1", "2"]));

const explicitThenAuto = render([
  "::: question 题目 7",
  "题干",
  ":::",
  "",
  "::: question 题目",
  "题干",
  ":::",
].join("\n"));
check("显式题号接着往下自动编号", JSON.stringify([...explicitThenAuto.matchAll(/<span class="question-block-number">([^<]*)<\/span>/gu)].map((match) => match[1])) === JSON.stringify(["7", "8"]));

const noNumber = render(["::: question 例题 number=none", "题干", ":::", "", "::: question 例题", "题干", ":::"].join("\n"));
check("number=none 关闭题号", !/question-block-number">第/u.test(noNumber));
check("number=none 不占用序号", /<span class="question-block-number">1<\/span>/u.test(noNumber));

const firstRender = render(["::: question 例题", "题干", ":::"].join("\n"));
check("每次渲染重新从 1 开始", /<span class="question-block-number">1<\/span>/u.test(firstRender));

const defaultBadge = render(["::: question", "题干", ":::"].join("\n"));
check("默认徽标不自动编号", defaultBadge.includes('<span class="question-block-label">解答题</span>') && !defaultBadge.includes("question-block-number"));

// 5. <question> 标签写法与 ::: 等价
const tag = render([
  "<question>",
  "取下列各物质各 1g 溶于 1000g 苯，凝固点最高的是：",
  "",
  "- A. 氯甲烷",
  "- B. 二氯甲烷",
  "- C. 三氯甲烷",
  "- D. 四氯化碳",
  "</question>",
].join("\n"));
check("<question> 生成同样的题型", tag.includes("question-block--choice") && !tag.includes("<question>"));
check("<question> 选项数正确", (tag.match(/class="question-block-option"/gu) || []).length === 4);

const tagAnswer = render(["<question>", "简述拉乌尔定律。", "</question>"].join("\n"));
check("<question> 无选项时为解答题", tagAnswer.includes("question-block--answer") && !tagAnswer.includes("question-block-options"));

// 6. 一行写完的选项
const inline = render([
  "::: question",
  "下列说法正确的是：",
  "",
  "A. $0.36^\\circ\\mathrm{C}$　B. $0.28^\\circ\\mathrm{C}$　C. $-0.36^\\circ\\mathrm{C}$　D. $-0.28^\\circ\\mathrm{C}$",
  ":::",
].join("\n"));
check("同行选项被拆成四列", (inline.match(/class="question-block-option"/gu) || []).length === 4);
check("同行选项标号正确", inline.includes('<span class="question-block-option-label">D</span>'));

// 7. 代码围栏里的同名标记不受影响
const fenced = render([
  "```markdown",
  "::: question",
  "题干",
  ":::",
  "```",
].join("\n"));
check("代码围栏内容原样保留", fenced.includes("::: question") && !fenced.includes("question-block"));

// 8. 未闭合时退回普通文本，不产生空块
const unclosed = render(["::: question", "题干很长", "", "下一段"].join("\n"));
check("未闭合不生成题目块", !unclosed.includes("question-block") && unclosed.includes("::: question"));

// 9. 编辑器行号锚点仍指向源码行
const anchored = md.render(["前一段", "", "::: question", "题干", "", "- A. 甲", ":::   ", "", "后一段"].join("\n"));
const sourceLine = /class="question-block[^"]*"[^>]*data-source-line="(\d+)"/u.exec(anchored);
check("题目块带 data-source-line", Boolean(sourceLine));
check("行号指向 ::: 所在行", sourceLine?.[1] === "3", `实际 ${sourceLine?.[1]}`);
check("data-source-end 覆盖整块", /data-source-end="7"/u.test(anchored));

// 10. 正文里的行内公式与题目块共用同一套渲染
check("普通正文公式仍然渲染", md.render("正文 $E=mc^2$ 结束").includes("katex"));

// 11. 选项里嵌的小列表不会被当成新选项
const nested = render([
  "::: question",
  "题干：",
  "",
  "- A. 甲",
  "  - 甲的子项",
  "- B. 乙",
  ":::",
].join("\n"));
check("选项内嵌列表不产生多余选项", (nested.match(/class="question-block-option"/gu) || []).length === 2);
check("续行归上方选项", nested.includes("甲的子项") && nested.indexOf("甲的子项") < nested.indexOf('<span class="question-block-option-label">B</span>'));

// 12. 缩进写法的题目块（例如整块嵌在列表里）同样解析选项
const indented = render([
  "::: question",
  "题干：",
  "",
  "  - A. 甲",
  "  - B. 乙",
  ":::",
].join("\n"));
check("缩进选项正常解析", (indented.match(/class="question-block-option"/gu) || []).length === 2);

for (const name of checks) {
  if (!failures.includes(name) && !failures.some((failure) => failure.startsWith(name))) console.log(`PASS ${name}`);
}
if (failures.length) {
  console.error(`\nFAIL ${failures.length}/${checks.length}`);
  for (const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}
console.log(`\n全部通过：${checks.length} 项检查`);
