export const items = [
  { id: 'r001', label: '课堂笔记 / 复习岩石分类' },
  { id: 'r002', label: '矿物识别 / 观察记录' },
  { id: 'r003', label: '练习题 / 复习岩石分类' }
];

export function initialProgress(scenario) {
  if (!['complete', 'cancel'].includes(scenario)) throw new Error('未知场景');
  return { r001: scenario === 'cancel', r002: false, r003: false };
}

export function submitProgress(shared, baseRevision, incoming, strategy) {
  if (!['replace', 'merge', 'version'].includes(strategy)) throw new Error('未知提交方式');
  if (strategy === 'version' && baseRevision !== shared.revision) {
    return {
      accepted: false,
      shared: { revision: shared.revision, progress: { ...shared.progress } }
    };
  }
  const progress = Object.fromEntries(items.map(({ id }) => [id,
    strategy === 'merge' ? shared.progress[id] || incoming[id] : incoming[id]
  ]));
  return { accepted: true, shared: { revision: shared.revision + 1, progress } };
}
