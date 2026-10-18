import path from "node:path";
import { readFileSync, existsSync } from "node:fs";

const isDevelopment = process.env.ELEVENTY_RUN_MODE === "serve";

export default {
  layout: "layouts/post.njk",
  contentType: "project",
  tags: ["project-pages"],
  eleventyComputed: {
    projectHomeUrl: (data) => `/blog/projects/${encodeURIComponent(data.projectId)}/index.html`,
    permalink: (data) => {
      const homePath = path.join(path.dirname(data.page.inputPath), "index.md");
      const homeDraft = existsSync(homePath) && /^draft:\s*true\s*$/m.test(readFileSync(homePath, "utf8").split(/^---\s*$/m)[1] || "");
      if ((data.draft || homeDraft) && !isDevelopment) return false;
      return `/blog/projects/${encodeURIComponent(data.projectId)}/${encodeURIComponent(path.basename(data.page.inputPath, ".md"))}.html`;
    },
    eleventyExcludeFromCollections: (data) => {
      const homePath = path.join(path.dirname(data.page.inputPath), "index.md");
      const homeDraft = existsSync(homePath) && /^draft:\s*true\s*$/m.test(readFileSync(homePath, "utf8").split(/^---\s*$/m)[1] || "");
      return Boolean(!isDevelopment && (data.draft || homeDraft));
    },
  },
};
