import previous from "./rearrange.js";
import edition from "./rearrangeEdition.js";

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

export default previous.nodes
  .filter((node) => !edition.sceneBySlug[node.slug])
  .map((node) => ({ slug: node.slug, title: node.title, target: target[node.slug] }));
