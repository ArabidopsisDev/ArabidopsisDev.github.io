import previous from "./rearrange.js";
import atlas from "./rearrangeAtlas.js";

const target = {
  "hard-drive-no-chronology": "archive-seams",
  "lost-commit": "let-it-remain-open",
  "camera-remembers-home": "archive-seams",
  "life-does-not-archive": "borrowed-time",
  "old-drive-no-answer": "sunset",
  "toy-government": "toy-constitution",
  "screen-not-shop-window": "first-window",
  "folders-before-git": "first-window",
  "exam-machine-user": "real-users",
  "rules-with-exit": "toy-constitution",
  "exam-as-final-battle": "no-final-score",
  "six-to-ten-thirty": "borrowed-time",
  "meritocracy-cost": "no-final-score",
  "awards-without-rule": "no-final-score",
  "not-a-rising-curve": "sunset",
  "saturday-field": "field-questions",
  "field-enters-data": "field-questions",
  "explore-not-memorize": "natural-history",
  "one-person-studio": "toy-constitution",
  "friends-different-schedules": "missing-dialogue",
  "integration-0410": "collective-night",
  "repository-after-podium": "collective-night",
  "same-ppt": "many-voices",
  "try-many-voices": "many-voices",
  "many-media": "many-voices",
  "real-user-feedback": "real-users",
  "tide-before-sunset": "sunset",
};

const redirects = previous.nodes
  .filter((node) => !atlas.bySlug[node.slug])
  .map((node) => {
    const destination = target[node.slug] || atlas.retired[node.slug];
    return { slug: node.slug, title: node.title, target: atlas.retired[destination] || destination };
  });
for (const [slug, destination] of Object.entries(atlas.retired)) {
  if (!redirects.some((item) => item.slug === slug)) redirects.push({ slug, title: "已重新编排的回忆", target: destination });
}
for (const redirect of redirects) {
  if (!atlas.bySlug[redirect.target]) throw new Error("Missing redirect target: " + redirect.slug);
}
export default redirects;
