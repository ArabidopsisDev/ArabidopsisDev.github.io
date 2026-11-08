import { items, initialProgress, submitProgress } from './sync-core.js';

const scenario = document.querySelector('#scenario');
const strategy = document.querySelector('#strategy');
const computerButton = document.querySelector('#submit-computer');
const phoneButton = document.querySelector('#submit-phone');
const log = document.querySelector('#event-log');
let shared;
let computer;
let phone;

function record(message) {
  const li = document.createElement('li');
  li.textContent = message;
  log.append(li);
}

function message(text, kind = 'normal') {
  document.querySelector('#message').textContent = text;
  document.querySelector('#result').dataset.kind = kind;
}

function renderRecord(prefix, data, revisionText) {
  document.querySelector(`#${prefix}-revision`).textContent = revisionText;
  const list = document.querySelector(`#${prefix}-records`);
  list.replaceChildren();
  for (const item of items) {
    const row = document.createElement('div');
    const dt = document.createElement('dt');
    const id = document.createElement('small');
    dt.textContent = item.label;
    id.textContent = item.id;
    dt.append(id);
    const dd = document.createElement('dd');
    dd.dataset.completed = String(data[item.id]);
    dd.textContent = data[item.id] ? '已完成' : '未完成';
    row.append(dt, dd);
    list.append(row);
  }
}

function render() {
  renderRecord('computer', computer.progress, `数据基于共享版本：${computer.baseRevision}`);
  renderRecord('phone', phone.progress, `数据基于共享版本：${phone.baseRevision}`);
  renderRecord('shared', shared.progress, `当前共享版本：${shared.revision}`);
}

function reset() {
  const progress = initialProgress(scenario.value);
  shared = { revision: 7, progress: { ...progress } };
  computer = { baseRevision: 7, progress: { ...progress } };
  phone = { baseRevision: 7, progress: { ...progress } };
  computerButton.disabled = false;
  phoneButton.disabled = true;
  strategy.disabled = false;
  log.replaceChildren();
  document.querySelector('#scenario-description').textContent = scenario.value === 'complete'
    ? '两台设备最初都将三项内容记为未完成。使用者先在电脑上完成课堂笔记并上传，然后在手机上完成矿物识别。手机仍根据原先的进度提交。我们希望共享记录保留这两项内容的完成状态。'
    : '两台设备最初都把课堂笔记记为已完成。使用者先在电脑上取消这项勾选并上传，然后在手机上完成矿物识别。手机仍带着课堂笔记已完成的旧状态提交。我们希望共享记录保留课堂笔记未完成、矿物识别已完成的状态。';
  record('电脑与手机都读取了第 7 版共享记录。');
  message('先提交电脑的修改，再观察手机携带旧版本提交时会怎样改变共享记录。');
  render();
}

computerButton.addEventListener('click', () => {
  computer.progress.r001 = scenario.value === 'complete';
  const result = submitProgress(shared, computer.baseRevision, computer.progress, 'version');
  shared = result.shared;
  computer.baseRevision = shared.revision;
  computerButton.disabled = true;
  phoneButton.disabled = false;
  record(`${scenario.value === 'complete' ? '使用者在电脑上完成了课堂笔记' : '使用者在电脑上取消了课堂笔记的勾选'}，提交成功，共享记录从第 7 版更新为第 8 版。`);
  message('电脑的修改已保存到共享记录。手机还保留第 7 版，没有读取电脑的修改。');
  render();
});

phoneButton.addEventListener('click', () => {
  phone.progress.r002 = true;
  const result = submitProgress(shared, phone.baseRevision, phone.progress, strategy.value);
  const before = shared.revision;
  shared = result.shared;
  phoneButton.disabled = true;
  strategy.disabled = true;
  if (!result.accepted) {
    record(`手机按第 ${phone.baseRevision} 版提交，共享记录已是第 ${before} 版，提交被拒绝，共享记录未改变。`);
    message('共享记录保留了电脑上传的结果。手机上矿物识别的完成状态仍留在本机，尚未同步。后续还需要读取最新共享记录，解决冲突后再提交。', 'blocked');
  } else {
    phone.baseRevision = shared.revision;
    phone.progress = { ...shared.progress };
    record(`使用者在手机上完成矿物识别，手机使用“${strategy.options[strategy.selectedIndex].text}”提交，共享记录更新为第 ${shared.revision} 版。`);
    if (scenario.value === 'cancel') {
      message('共享记录中的矿物识别为已完成，课堂笔记也重新变成了已完成。使用者在电脑上取消课堂笔记勾选的结果被覆盖了。', 'warning');
    } else if (strategy.value === 'replace') {
      message('矿物识别已完成，但课堂笔记变回未完成，电脑刚保存的完成记录被旧值覆盖了。', 'warning');
    } else {
      message('共享记录保留了课堂笔记和矿物识别的完成状态。这个结果符合两台设备分别完成不同内容的需要。接下来可以切换到取消勾选的情况，继续比较提交结果。');
    }
  }
  render();
});

scenario.addEventListener('change', reset);
document.querySelector('#reset').addEventListener('click', reset);
reset();
