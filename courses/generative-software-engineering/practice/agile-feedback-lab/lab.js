import { items, createState, transition, isDirty, statusText } from './state-core.js';

let state = createState();
const list = document.querySelector('#items');
const showStatus = document.querySelector('#show-status');
const detail = document.querySelector('#upload-status');
const message = document.querySelector('#action-result');
for (const item of items) {
  const label = document.createElement('label');
  label.className = 'item';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.dataset.id = item.id;
  input.addEventListener('change', () => act({ type: 'edit', id: item.id, completed: input.checked }));
  const title = document.createElement('span');
  title.textContent = item.title;
  label.append(input, title);
  list.append(label);
}

function render() {
  for (const input of list.querySelectorAll('input')) {
    input.checked = state.local.progress[input.dataset.id];
  }
  const count = items.filter(({ id }) => state.local.progress[id]).length;
  document.querySelector('#completion').textContent = '本机已完成 ' + count + ' / 3 项';
  detail.hidden = !showStatus.checked;
  detail.textContent = statusText(state);
  detail.dataset.state = state.rejected && isDirty(state) ? 'rejected' : isDirty(state) ? 'pending' : 'saved';
  message.textContent = state.message;
  document.querySelector('#shared-version').textContent = '第 ' + state.shared.revision + ' 版共享记录';
  const records = document.querySelector('#shared-items');
  records.replaceChildren();
  for (const item of items) {
    const row = document.createElement('li');
    row.textContent = item.title + '：' + (state.shared.progress[item.id] ? '已完成' : '未完成');
    records.append(row);
  }
}
function act(action) {
  state = transition(state, action);
  render();
}
showStatus.addEventListener('change', render);
document.querySelector('#upload').addEventListener('click', () => act({ type: 'upload' }));
document.querySelector('#read').addEventListener('click', () => act({ type: 'read' }));
document.querySelector('#remote').addEventListener('click', () => act({ type: 'remote' }));
document.querySelector('#reset').addEventListener('click', () => {
  showStatus.checked = false;
  act({ type: 'reset' });
});
render();

