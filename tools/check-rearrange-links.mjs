import fs from "node:fs";
import path from "node:path";
import atlas from "../site/_data/rearrangeAtlas.js";
import diary from "../site/_data/rearrangeDiary.json" with { type: "json" };

const root = path.resolve("_site");
function files(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? files(full) : full.endsWith(".html") ? [full] : [];
  });
}
const failures = [];
const pages = files(path.join(root, "stories/rearrange"));
for (const file of pages) {
  const html = fs.readFileSync(file, "utf8");
  const relative = "/" + path.relative(root, file).replaceAll("\\", "/");
  const base = new URL(relative.replace(/index\.html$/u, ""), "https://preview.invalid");
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/gu)) {
    const url = new URL(match[1].replaceAll("&amp;", "&"), base);
    if (url.origin !== base.origin) continue;
    const pathname = decodeURIComponent(url.pathname);
    const target = path.join(root, pathname.endsWith("/") ? pathname + "index.html" : pathname);
    if (!fs.existsSync(target)) {
      failures.push(`${relative}: missing ${pathname}`);
      continue;
    }
    if (url.hash && target.endsWith(".html")) {
      const id = decodeURIComponent(url.hash.slice(1));
      if (!fs.readFileSync(target, "utf8").includes(`id="${id}"`)) failures.push(`${relative}: missing anchor ${pathname}#${id}`);
    }
  }
}
for (const week of diary.weeks) {
  for (const entry of week.entries) {
    for (const connection of entry.connections) {
      if (!atlas.bySlug[connection.to]) failures.push("Diary refers to retired scene: " + connection.to);
    }
  }
}
const home = fs.readFileSync(path.join(root, "stories/rearrange/index.html"), "utf8");
for (const lens of atlas.lenses) if (!home.includes(lens.quote)) failures.push("Missing exact quotation: " + lens.id);
if (home.includes("五个场景") || home.includes(" / 15")) failures.push("Fixed-size sequence remains on homepage");
if (failures.length) {
  failures.forEach((failure) => console.error(failure));
  process.exitCode = 1;
} else {
  console.log(`Checked ${pages.length} pages: links, diary anchors, retired routes, and original quotations pass.`);
}
