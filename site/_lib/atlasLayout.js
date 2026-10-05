// World coordinates grow with the data. The viewport never sets a node limit.
// The current primary reading influences position; older readings stay intact.
export function layoutAtlas(nodes) {
  const groups = new Map(["unknown", "release", "becoming"].map((id) => [id, []]));
  for (const node of nodes) groups.get(node.lenses[0]).push(node);
  const reach = Math.max(...[...groups.values()].map((group) => Math.sqrt(group.length + 1) * 200));
  const centers = {
    unknown: { x: -reach * 1.12, y: -reach * .42 },
    release: { x: 0, y: reach * .83 },
    becoming: { x: reach * 1.12, y: -reach * .42 }
  };
  const positions = [];
  for (const [id, group] of groups) {
    group.sort((a, b) => a.slug.localeCompare(b.slug));
    for (const [index, node] of group.entries()) {
      const radius = Math.sqrt(index + .8) * 190;
      const angle = index * 2.399963 + (id === "release" ? .4 : 1.2);
      positions.push({ slug: node.slug, x: centers[id].x + Math.cos(angle) * radius, y: centers[id].y + Math.sin(angle) * radius * .78 });
    }
  }
  // Resolve nearby label rectangles without imposing rows or equal groups.
  for (let pass = 0; pass < 60; pass++) {
    let collisions = 0;
    for (let i = 0; i < positions.length; i++) for (let j = i + 1; j < positions.length; j++) {
      const a = positions[i], b = positions[j];
      const dx = b.x - a.x, dy = b.y - a.y;
      const overlapX = 255 - Math.abs(dx), overlapY = 135 - Math.abs(dy);
      if (overlapX <= 0 || overlapY <= 0) continue;
      collisions++;
      if (overlapX < overlapY) {
        const push = (overlapX + 2) / 2 * (dx >= 0 ? 1 : -1);
        a.x -= push; b.x += push;
      } else {
        const push = (overlapY + 2) / 2 * (dy >= 0 ? 1 : -1);
        a.y -= push; b.y += push;
      }
    }
    if (!collisions) break;
  }
  const minX = Math.min(...positions.map((p) => p.x)) - 190;
  const minY = Math.min(...positions.map((p) => p.y)) - 110;
  const width = Math.ceil(Math.max(...positions.map((p) => p.x)) - minX + 190);
  const height = Math.ceil(Math.max(...positions.map((p) => p.y)) - minY + 155);
  return { width, height, positions: Object.fromEntries(positions.map((p) => [p.slug, { x: Math.round(p.x - minX), y: Math.round(p.y - minY) }])) };
}
