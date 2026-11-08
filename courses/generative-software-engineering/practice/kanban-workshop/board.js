import { stages, createBoard, activeCount, actOnBoard } from './board-core.js';
let board = createBoard();
const area = document.querySelector('#board');
const message = document.querySelector('#message');
function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function button(text, action) {
  const node = element('button', text);
  node.type = 'button';
  node.addEventListener('click', () => act(action));
  return node;
}
function render() {
  document.querySelector('#active-count').textContent = activeCount(board) + ' / ' + board.limit;
  document.querySelector('#blocked-count').textContent = board.cards.filter(c => c.blocked).length;
  document.querySelector('#done-count').textContent = board.cards.filter(c => c.stage === 'done').length;
  document.querySelector('#limit').value = String(board.limit);
  message.textContent = board.message;
  area.replaceChildren();
  for (const stage of stages) {
    const column = element('section', undefined, 'column');
    column.dataset.stage = stage.id;
    const cards = board.cards.filter(c => c.stage === stage.id);
    column.append(element('h2', stage.title + ' / ' + cards.length));
    for (const card of cards) {
      const item = element('article', undefined, 'card' + (card.blocked ? ' blocked' : ''));
      item.dataset.card = card.id;
      const heading = element('h3', card.title);
      item.append(heading, element('p', card.owner, 'owner'));
      const detail = element('details');
      detail.append(element('summary', '查看本项完成条件'));
      const criteria = element('ul');
      for (const rule of card.criteria) criteria.append(element('li', rule));
      detail.append(criteria); item.append(detail);
      if (card.blocked) {
        item.append(element('p', '受阻：' + card.reason, 'block-reason'));
        item.append(button('解除阻碍', { type: 'unblock', id: card.id }));
      } else {
        const actions = element('div', undefined, 'card-actions');
        if (stage.id === 'ready') actions.append(button('开始开发', { type: 'move', id: card.id, to: 'doing' }));
        if (stage.id === 'doing') actions.append(button('移到待验证', { type: 'move', id: card.id, to: 'verify' }));
        if (stage.id === 'verify') {
          const label = element('label', undefined, 'confirm');
          const check = element('input');
          check.type = 'checkbox'; check.checked = card.checked;
          check.addEventListener('change', () => act({ type: 'check', id: card.id, value: check.checked }));
          label.append(check, element('span', '已核对本项完成条件'));
          item.append(label);
          actions.append(button('标为已完成', { type: 'move', id: card.id, to: 'done' }));
          actions.append(button('返回开发', { type: 'move', id: card.id, to: 'doing' }));
        }
        if (stage.id === 'done') actions.append(button('重新打开', { type: 'move', id: card.id, to: 'doing' }));
        item.append(actions);
        if (stage.id === 'doing' || stage.id === 'verify') {
          const blockForm = element('details', undefined, 'block-form');
          blockForm.append(element('summary', '记录阻碍'));
          const label = element('label', '缺少什么 / 需要联系谁');
          const input = element('input');
          input.type = 'text'; input.maxLength = 160;
          label.append(input);
          const save = element('button', '标记受阻');
          save.type = 'button';
          save.addEventListener('click', () => act({ type: 'block', id: card.id, reason: input.value }));
          blockForm.append(label, save); item.append(blockForm);
        }
      }
      column.append(item);
    }
    if (!cards.length) column.append(element('p', '当前没有卡片。', 'empty'));
    area.append(column);
  }
  const events = document.querySelector('#events');
  events.replaceChildren();
  for (const entry of board.events.slice(-8).reverse()) events.append(element('li', entry));
}
function act(action) {
  board = actOnBoard(board, action);
  render();
}
document.querySelector('#limit').addEventListener('change', e => act({ type: 'limit', value: Number(e.target.value) }));
document.querySelector('#reset').addEventListener('click', () => act({ type: 'reset' }));
render();

