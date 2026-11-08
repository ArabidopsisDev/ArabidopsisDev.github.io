export const items = [
  { id: 'r001', title: '课堂笔记' },
  { id: 'r002', title: '矿物识别' },
  { id: 'r003', title: '练习题' }
];

export function createState() {
  const progress = { r001: false, r002: false, r003: false };
  return {
    local: { progress: { ...progress }, baseProgress: { ...progress }, baseRevision: 7 },
    shared: { progress: { ...progress }, revision: 7 },
    submittedRevision: null,
    rejected: false,
    message: ''
  };
}

export function isDirty(state) {
  return items.some(({ id }) => state.local.progress[id] !== state.local.baseProgress[id]);
}

export function statusText(state) {
  if (isDirty(state)) {
    if (state.rejected) {
      return '上次提交因版本过旧被拒绝。本机的修改已经保留，这些修改尚未上传。';
    }
    return '本机有待上传的修改。上次读取的是第 ' + state.local.baseRevision + ' 版共享记录。';
  }
  if (state.submittedRevision !== null) {
    return '本机当前进度已上传到第 ' + state.submittedRevision + ' 版共享记录。';
  }
  return '本机当前显示的是上次读取的第 ' + state.local.baseRevision + ' 版共享进度。';
}

export function transition(current, action) {
  if (action.type === 'reset') return createState();
  const state = structuredClone(current);
  if (action.type === 'edit') {
    if (!items.some(({ id }) => id === action.id) || typeof action.completed !== 'boolean') {
      throw new Error('条目编号或完成状态无效');
    }
    state.local.progress[action.id] = action.completed;
    state.message = '';
  } else if (action.type === 'upload') {
    if (!isDirty(state)) {
      state.message = '本机没有待上传的修改，共享记录保持原状。';
    } else if (state.local.baseRevision !== state.shared.revision) {
      state.rejected = true;
      state.message = '提交被拒绝：共享记录已经更新。本机的修改仍保留，尚未上传。';
    } else {
      state.shared.progress = { ...state.local.progress };
      state.shared.revision += 1;
      state.local.baseProgress = { ...state.local.progress };
      state.local.baseRevision = state.shared.revision;
      state.submittedRevision = state.shared.revision;
      state.rejected = false;
      state.message = '上传成功，共享记录已保存为第 ' + state.shared.revision + ' 版。';
    }
  } else if (action.type === 'read') {
    if (isDirty(state)) {
      state.message = '读取已停止：本机有待上传的修改。当前实验保留这些修改，冲突合并需要另外实现。';
    } else {
      state.local.progress = { ...state.shared.progress };
      state.local.baseProgress = { ...state.shared.progress };
      state.local.baseRevision = state.shared.revision;
      state.submittedRevision = null;
      state.rejected = false;
      state.message = '已读取第 ' + state.shared.revision + ' 版共享记录。';
    }
  } else if (action.type === 'remote') {
    if (!state.shared.progress.r003) {
      state.shared.progress.r003 = true;
      state.shared.revision += 1;
      state.message = '已模拟使用者在手机上勾选“练习题”并上传，共享记录成为第 ' + state.shared.revision + ' 版。';
    } else {
      state.message = '共享记录中的练习题已经完成，版本保持原状。';
    }
  } else {
    throw new Error('操作类型无效');
  }
  return state;
}

