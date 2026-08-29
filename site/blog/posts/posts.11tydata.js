const isDevelopment = process.env.ELEVENTY_RUN_MODE === "serve";

export default {
  layout: "layouts/post.njk",
  tags: ["posts"],
  eleventyComputed: {
    permalink: (data) => data.draft && !isDevelopment
      ? false
      : `/blog/posts/${data.page.fileSlug}.html`,
    eleventyExcludeFromCollections: (data) => Boolean(data.draft && !isDevelopment),
  },
};
