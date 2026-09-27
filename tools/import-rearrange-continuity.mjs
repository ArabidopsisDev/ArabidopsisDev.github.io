import fs from "node:fs";
import path from "node:path";
import edition from "../site/_data/rearrangeEdition.js";

const folder = path.resolve(process.argv[2]);
const file = path.resolve("site/_data/rearrangeNarratives.json");
const narratives = JSON.parse(fs.readFileSync(file, "utf8"));
const manual = new Set(["no-final-score", "let-it-remain-open", "collective-night", "sunset"]);

for (const scene of edition.scenes) {
  if (narratives[scene.slug] || manual.has(scene.slug)) continue;
  const draftFile = path.join(folder, `${scene.slug}.json`);
  const draft = JSON.parse(fs.readFileSync(draftFile, "utf8").replace(/^\uFEFF/u, ""));
  if (!Array.isArray(draft.paragraphs) || draft.paragraphs.length !== 8 || !Number.isInteger(draft.hingeAfter)) {
    throw new Error(`Invalid draft: ${scene.slug}`);
  }
  narratives[scene.slug] = { hingeAfter: draft.hingeAfter, paragraphs: draft.paragraphs };
}
fs.writeFileSync(file, JSON.stringify(narratives, null, 2) + "\n", "utf8");
console.log(`Imported ${Object.keys(narratives).length} narratives`);
