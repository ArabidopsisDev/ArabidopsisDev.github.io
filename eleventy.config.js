import path from "node:path";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

const SITE_URL = "https://arabid.top";
const excludedTags = new Set(["posts", "all"]);

function toDate(value) {
  return value instanceof Date ? value : new Date(value);
}

function relativeUrl(target, from) {
  if (!target || /^(?:[a-z]+:)?\/\//i.test(target) || target.startsWith("mailto:")) return target;
  const [pathname, suffix = ""] = target.split(/(?=[?#])/u, 2);
  const source = from || "/";
  const fromDirectory = source.endsWith("/") ? source : path.posix.dirname(source);
  let result = path.posix.relative(fromDirectory, pathname || "/");
  if (!result) result = ".";
  if (!result.startsWith(".")) result = `./${result}`;
  if (pathname.endsWith("/") && !result.endsWith("/")) result += "/";
  return result + suffix;
}

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.setDataDeepMerge(true);

  const markdown = markdownIt({
    html: true,
    linkify: true,
    typographer: false,
  }).use(markdownItAnchor, {
    level: [2, 3],
    slugify: (value) => eleventyConfig.getFilter("slugify")(value),
  });
  eleventyConfig.setLibrary("md", markdown);

  const copies = {
    "./index.html": "index.html",
    "./history.html": "history.html",
    "./404.html": "404.html",
    "./index0.html": "index0.html",
    "./shop.html": "shop.html",
    "./assets": "assets",
    "./Admin": "Admin",
    "./Aim": "Aim",
    "./annex": "annex",
    "./Apps": "Apps",
    "./Article": "Article",
    "./codes": "codes",
    "./Docs": "Docs",
    "./news": "news",
    "./Proj": "Proj",
    "./Publicity": "Publicity",
    "./Services": "Services",
    "./courses": "courses",
    "./projects": "projects",
    "./stories/rearrange/assets": "stories/rearrange/assets",
    "./certificates": "certificates",
    "./CNAME": "CNAME",
    "./robots.txt": "robots.txt",
    "./site.webmanifest": "site.webmanifest",
    "./.nojekyll": ".nojekyll"
  };
  for (const [source, destination] of Object.entries(copies)) {
    eleventyConfig.addPassthroughCopy({ [source]: destination });
  }
  eleventyConfig.addWatchTarget("./assets/css/");
  eleventyConfig.addWatchTarget("./assets/js/");

  eleventyConfig.addCollection("posts", (collectionApi) =>
    collectionApi
      .getFilteredByGlob("./site/blog/posts/*.md")
      .filter((post) => !post.data.draft || process.env.ELEVENTY_RUN_MODE === "serve")
      .sort((a, b) => b.date - a.date)
  );
  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tags = new Set();
    for (const post of collectionApi.getFilteredByGlob("./site/blog/posts/*.md")) {
      for (const tag of post.data.tags || []) {
        if (!excludedTags.has(tag)) tags.add(tag);
      }
    }
    return [...tags].sort((a, b) => a.localeCompare(b, "zh-CN"));
  });

  eleventyConfig.addFilter("dateDisplay", (value) =>
    new Intl.DateTimeFormat("zh-CN", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(toDate(value)).replaceAll("/", ".")
  );
  eleventyConfig.addFilter("dateYear", (value) =>
    new Intl.DateTimeFormat("en", { timeZone: "Asia/Shanghai", year: "numeric" }).format(toDate(value))
  );
  eleventyConfig.addFilter("rfc3339", (value) => toDate(value).toISOString());
  eleventyConfig.addFilter("rssDate", (value) => toDate(value).toUTCString());
  eleventyConfig.addFilter("relativeUrl", relativeUrl);
  eleventyConfig.addFilter("absoluteUrl", (value) => new URL(value, SITE_URL).toString());
  eleventyConfig.addFilter("json", (value) => JSON.stringify(value));
  eleventyConfig.addFilter("stripHtml", (value = "") => value.replace(/<[^>]*>/gu, " ").replace(/\s+/gu, " ").trim());
  eleventyConfig.addFilter("xmlEscape", (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;"));
  eleventyConfig.addFilter("tagSlug", (value) => eleventyConfig.getFilter("slugify")(value));
  eleventyConfig.addFilter("postsByTag", (posts, tag) =>
    posts.filter((post) => (post.data.tags || []).includes(tag))
  );
  eleventyConfig.addFilter("publicTags", (tags = []) => tags.filter((tag) => !excludedTags.has(tag)));
  eleventyConfig.addFilter("readingTime", (content = "") => {
    const plain = content.replace(/<[^>]*>/gu, " ");
    const cjk = (plain.match(/[\u3400-\u9fff]/gu) || []).length;
    const words = (plain.replace(/[\u3400-\u9fff]/gu, " ").match(/[\p{L}\p{N}_-]+/gu) || []).length;
    return Math.max(1, Math.ceil((cjk + words) / 300));
  });
  eleventyConfig.addFilter("relatedPosts", (posts, currentUrl, currentTags = []) => {
    const wanted = new Set(currentTags.filter((tag) => !excludedTags.has(tag)));
    return posts
      .filter((post) => post.url !== currentUrl)
      .map((post) => ({
        post,
        score: (post.data.tags || []).filter((tag) => wanted.has(tag)).length,
      }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || b.post.date - a.post.date)
      .slice(0, 3)
      .map((entry) => entry.post);
  });
  eleventyConfig.addFilter("previousPost", (posts, currentUrl) => {
    const index = posts.findIndex((post) => post.url === currentUrl);
    return index >= 0 ? posts[index + 1] : null;
  });
  eleventyConfig.addFilter("nextPost", (posts, currentUrl) => {
    const index = posts.findIndex((post) => post.url === currentUrl);
    return index > 0 ? posts[index - 1] : null;
  });

  return {
    dir: {
      input: "site",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
}
