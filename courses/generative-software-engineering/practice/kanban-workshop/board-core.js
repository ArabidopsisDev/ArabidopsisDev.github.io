export const stages = [
  { id: 'ready', title: '待开始' },
  { id: 'doing', title: '开发中' },
  { id: 'verify', title: '待验证' },
  { id: 'done', title: '已完成' }
];
const initialCards = [
  { id: 'upload', title: '上传结果提示', stage: 'verify', owner: '网页开发者与服务端合作者',
    blocked: true, reason: '等待服务端合作者提供可访问的测试服务。', checked: false,
    criteria: ['勾选条目以后显示尚未上传。', '上传成功以后显示已经上传。', '提交被拒绝时保留本机修改，并说明尚未上传。', '使用者在上传前判断手机会读到未完成，上传成功后判断会读到已完成。'] },
  { id: 'confirm', title: '修复手机上的导入确认按钮', stage: 'doing', owner: '网页开发者',
    blocked: false, reason: '', checked: false,
    criteria: ['在准备支持的手机尺寸下能看到并点击确认按钮。', '确认后按原定规则保存，取消时保留原进度。'] },
  { id: 'filename', title: '导出文件名显示日期', stage: 'ready', owner: '网页开发者',
    blocked: false, reason: '', checked: false,
    criteria: ['下载文件名包含生成当天的日期。', '文件内容沿用已有格式，原来的导入功能仍能读取。'] },
  { id: 'preview', title: '上传前查看进度变化', stage: 'ready', owner: '网页开发者与服务端合作者',
    blocked: false, reason: '', checked: false,
    criteria: ['使用者确认前能够查看本机与共享进度的差别。', '取消时保留原来的本机与共享记录。', '读取或提交失败时说明失败，并保留本机修改。'] }
];
export function createBoard() {
  return { limit: 2, cards: structuredClone(initialCards), events: [], message: '' };
}
export function activeCount(board) {
  return board.cards.filter(c => c.stage === 'doing' || c.stage === 'verify').length;
}
function report(board, message) {
  board.message = message;
  board.events.push(message);
  return board;
}
export function actOnBoard(current, action) {
  if (action.type === 'reset') return createBoard();
  const board = structuredClone(current);
  if (action.type === 'limit') {
    if (![2, 3, 4].includes(action.value)) throw new Error('上限必须为 2、3 或 4');
    if (action.value < activeCount(board)) {
      return report(board, '上限尚未修改：当前已经开始的工作超过所选数值，请保留这些卡片的实际状态。');
    }
    board.limit = action.value;
    return report(board, '进行中工作上限已改为 ' + board.limit + '。');
  }
  const card = board.cards.find(c => c.id === action.id);
  if (!card) throw new Error('找不到这项工作');
  if (action.type === 'check') {
    if (card.stage !== 'verify' || card.blocked) return report(board, '这项工作需要先进入待验证，并解除阻碍。');
    card.checked = Boolean(action.value);
    board.message = card.checked ? '已在当前推演中确认这项工作的完成条件。' : '已取消对完成条件的确认。';
    return board;
  }
  if (action.type === 'block') {
    if (!['doing', 'verify'].includes(card.stage)) return report(board, '只有已经开始、尚未完成的工作可以标记受阻。');
    const reason = typeof action.reason === 'string' ? action.reason.trim() : '';
    if (!reason) return report(board, '请填写当前缺少什么，以及需要联系谁。');
    card.blocked = true; card.reason = reason; card.checked = false;
    return report(board, card.title + '已标记受阻，仍计入进行中工作。');
  }
  if (action.type === 'unblock') {
    if (!card.blocked) return report(board, '这项工作当前没有受阻标记。');
    card.blocked = false; card.reason = '';
    return report(board, card.title + '已解除阻碍，当前列保持原状。');
  }
  if (action.type !== 'move') throw new Error('操作类型无效');
  const allowed = { ready: ['doing'], doing: ['verify'], verify: ['doing', 'done'], done: ['doing'] };
  if (!allowed[card.stage]?.includes(action.to)) return report(board, '请按照当前工作步骤移动卡片。');
  if (card.blocked) return report(board, '这项工作仍有阻碍，请联系相关成员处理以后再移动。');
  const entering = ['ready', 'done'].includes(card.stage);
  if (entering && activeCount(board) >= board.limit) {
    return report(board, '当前已有 ' + activeCount(board) + ' 项工作进行中，上限为 ' + board.limit + '。请处理已经开始的工作。');
  }
  if (action.to === 'done' && !card.checked) {
    return report(board, '尚未确认本项完成条件，请逐条核对后勾选确认。');
  }
  const from = stages.find(s => s.id === card.stage).title;
  const to = stages.find(s => s.id === action.to).title;
  card.stage = action.to;
  card.checked = false;
  return report(board, card.title + '：从' + from + '移到' + to + '。');
}

