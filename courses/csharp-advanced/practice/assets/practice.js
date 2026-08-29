(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector('[data-theme-toggle]');
  const savedTheme = localStorage.getItem('course-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) root.dataset.theme = 'dark';

  themeButton?.addEventListener('click', () => {
    const dark = root.dataset.theme === 'dark';
    root.dataset.theme = dark ? 'light' : 'dark';
    localStorage.setItem('course-theme', dark ? 'light' : 'dark');
  });

  const header = document.querySelector('[data-header]');
  const syncHeader = () => header?.classList.toggle('scrolled', window.scrollY > 10);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  const data = globalThis.EXERCISE_DATA;
  const lessonList = document.querySelector('[data-lesson-list]');
  const lessonSearch = document.querySelector('[data-lesson-search]');
  const heading = document.querySelector('[data-lesson-heading]');
  const questionList = document.querySelector('[data-question-list]');
  const lessonActions = document.querySelector('[data-lesson-actions]');
  const resultSummary = document.querySelector('[data-result-summary]');
  const submitButton = document.querySelector('[data-submit-lesson]');
  const filterButton = document.querySelector('[data-filter-wrong]');
  const retryButton = document.querySelector('[data-retry-wrong]');
  const resetButton = document.querySelector('[data-reset-lesson]');
  const prevButton = document.querySelector('[data-prev-lesson]');
  const nextButton = document.querySelector('[data-next-lesson]');
  const progressLabel = document.querySelector('[data-progress-label]');
  const progressBar = document.querySelector('[data-progress-bar]');
  const storageKey = 'arabidopsis-csharp-practice-v1';
  let wrongOnly = false;

  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const normalize = (value) => String(value ?? '')
    .toLocaleLowerCase('zh-CN')
    .replace(/[\s,，;；、。()（）`'"“”‘’]+/gu, '');

  const readState = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || '{}');
      return {
        version: 1,
        currentLesson: Number(parsed.currentLesson) || 1,
        lessons: parsed.lessons && typeof parsed.lessons === 'object' ? parsed.lessons : {},
      };
    } catch {
      return { version: 1, currentLesson: 1, lessons: {} };
    }
  };

  const state = readState();
  const saveState = () => localStorage.setItem(storageKey, JSON.stringify(state));
  const lessonState = (number) => {
    const key = String(number);
    state.lessons[key] ||= { answers: {}, selfGrades: {}, submitted: false };
    state.lessons[key].answers ||= {};
    state.lessons[key].selfGrades ||= {};
    return state.lessons[key];
  };

  const lessonByNumber = (number) => data.lessons.find((lesson) => lesson.number === number);
  const selectedValues = (question, local) => {
    const value = local.answers[question.id];
    if (question.mode === 'multiple') return Array.isArray(value) ? value : [];
    return typeof value === 'string' ? value : '';
  };

  const textMatches = (value, expected) => {
    const parts = String(expected).split(/[;；]/u).map(normalize).filter(Boolean);
    const actual = normalize(value);
    if (!actual || !parts.length) return false;
    if (parts.length === 1) return actual === parts[0];
    return parts.every((part) => actual.includes(part));
  };

  const resultFor = (question, local) => {
    if (!local.submitted) return 'ungraded';
    if (question.mode === 'subjective') return local.selfGrades[question.id] || 'pending';
    const value = selectedValues(question, local);
    let correct = false;
    if (question.mode === 'single') {
      correct = value === question.answer.trim().toUpperCase();
    } else if (question.mode === 'multiple') {
      const actual = [...value].sort().join('');
      const expected = [...question.answer.trim().toUpperCase()].sort().join('');
      correct = actual === expected;
    } else {
      correct = textMatches(value, question.answer);
    }
    return correct ? 'correct' : 'wrong';
  };

  const answerPresent = (question, local) => {
    const value = selectedValues(question, local);
    return Array.isArray(value) ? value.length > 0 : value.trim().length > 0;
  };

  const statusText = (result) => ({
    correct: '回答正确',
    wrong: '需要复习',
    mastered: '已掌握',
    review: '需要复习',
    pending: '等待自评',
  }[result] || '');

  const kindText = (mode) => ({
    single: '单选题',
    multiple: '多选题',
    text: '填空 / 简答',
    subjective: '综合题 · 自评',
  }[mode] || '练习题');

  const renderPrompt = (prompt) => prompt
    .split('\n')
    .filter(Boolean)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join('');

  const renderInput = (question, local) => {
    const disabled = local.submitted ? 'disabled' : '';
    const saved = selectedValues(question, local);
    if (question.mode === 'single' || question.mode === 'multiple') {
      const inputType = question.mode === 'single' ? 'radio' : 'checkbox';
      return `<div class="choice-list">${question.options.map((option, index) => {
        const letter = String.fromCharCode(65 + index);
        const checked = question.mode === 'multiple' ? saved.includes(letter) : saved === letter;
        return `<label class="choice-option">
          <input type="${inputType}" name="${escapeHtml(question.id)}" value="${letter}" ${checked ? 'checked' : ''} ${disabled} data-answer-input data-question-id="${escapeHtml(question.id)}">
          <span class="choice-letter">${letter}</span>
          <span class="choice-copy">${escapeHtml(option)}</span>
        </label>`;
      }).join('')}</div>`;
    }
    return `<textarea class="answer-field ${question.mode === 'subjective' ? 'subjective' : ''}" ${disabled} data-answer-input data-question-id="${escapeHtml(question.id)}" placeholder="${question.mode === 'subjective' ? '写下你的思路或代码，提交后对照参考解答自评' : '填写答案；多个空可用分号分隔'}">${escapeHtml(saved)}</textarea>`;
  };

  const renderReview = (question, local, result) => {
    if (!local.submitted) return '';
    const open = ['wrong', 'review', 'pending'].includes(result) ? 'open' : '';
    const reference = question.answer || '本题以解析中的思路为参考';
    const selfGrade = question.mode === 'subjective' ? `
      <div class="self-grade" aria-label="本题自评">
        <button type="button" class="${result === 'mastered' ? 'active' : ''}" data-self-grade="mastered" data-question-id="${escapeHtml(question.id)}">已掌握</button>
        <button type="button" class="${result === 'review' ? 'active' : ''}" data-self-grade="review" data-question-id="${escapeHtml(question.id)}">需要复习</button>
      </div>` : '';
    return `<details class="answer-review" ${open}>
      <summary>${result === 'correct' || result === 'mastered' ? '查看参考答案与解析' : '参考答案与错题解析'}</summary>
      <div class="answer-review-body">
        <dl>
          <dt>参考答案</dt><dd>${escapeHtml(reference)}</dd>
          <dt>${escapeHtml(question.explanationLabel || '解析')}</dt><dd>${escapeHtml(question.explanation || '文档未提供补充解析。')}</dd>
        </dl>
        ${selfGrade}
      </div>
    </details>`;
  };

  const renderQuestion = (question, local) => {
    const result = resultFor(question, local);
    const hidden = wrongOnly && local.submitted && ['correct', 'mastered'].includes(result);
    const images = question.images.length ? `<div class="question-media">${question.images.map((url) => `<img src="${escapeHtml(url)}" alt="第 ${question.number} 题配图" loading="lazy">`).join('')}</div>` : '';
    const code = question.code ? `<pre class="question-code"><code>${escapeHtml(question.code)}</code></pre>` : '';
    return `<article class="question-card ${local.submitted ? 'submitted' : ''} ${escapeHtml(result)}" data-question-card="${escapeHtml(question.id)}" ${hidden ? 'hidden' : ''}>
      <div class="question-topline">
        <span class="question-index">${question.group} · ${String(question.number).padStart(2, '0')}</span>
        <span class="question-kind">${kindText(question.mode)}</span>
        <span class="question-status">${statusText(result)}</span>
      </div>
      <div class="question-prompt">${renderPrompt(question.prompt)}</div>
      ${code}${images}${renderInput(question, local)}${renderReview(question, local, result)}
    </article>`;
  };

  const lessonMetrics = (lesson, local) => {
    const results = lesson.questions.map((question) => resultFor(question, local));
    const objective = lesson.questions.filter((question) => question.mode !== 'subjective');
    const subjective = lesson.questions.filter((question) => question.mode === 'subjective');
    return {
      results,
      objectiveCount: objective.length,
      objectiveCorrect: objective.filter((question) => resultFor(question, local) === 'correct').length,
      subjectiveCount: subjective.length,
      subjectiveMastered: subjective.filter((question) => resultFor(question, local) === 'mastered').length,
      subjectiveReview: subjective.filter((question) => resultFor(question, local) === 'review').length,
      subjectivePending: subjective.filter((question) => resultFor(question, local) === 'pending').length,
      answered: lesson.questions.filter((question) => answerPresent(question, local)).length,
    };
  };

  const renderResult = (lesson, local) => {
    if (!local.submitted) {
      resultSummary.hidden = true;
      resultSummary.className = 'result-summary';
      return;
    }
    const metrics = lessonMetrics(lesson, local);
    const wrong = metrics.objectiveCount - metrics.objectiveCorrect;
    const pending = metrics.subjectivePending;
    const review = wrong + metrics.subjectiveReview;
    const complete = !pending && !review;
    resultSummary.hidden = false;
    resultSummary.className = `result-summary ${complete ? 'complete' : 'review'}`;
    const title = complete ? '本节已完成，全部掌握。' : pending ? '自动批阅完成，请继续完成综合题自评。' : `本节批阅完成，${review} 道题需要复习。`;
    resultSummary.innerHTML = `<strong>${title}</strong><p>客观题 ${metrics.objectiveCorrect} / ${metrics.objectiveCount}；综合题已掌握 ${metrics.subjectiveMastered} / ${metrics.subjectiveCount}${pending ? `，还有 ${pending} 道待自评` : ''}。</p>`;
  };

  const renderGlobalStats = () => {
    const submitted = data.lessons.filter((lesson) => lessonState(lesson.number).submitted).length;
    let reviewCount = 0;
    data.lessons.forEach((lesson) => {
      const local = lessonState(lesson.number);
      if (!local.submitted) return;
      reviewCount += lesson.questions.filter((question) => ['wrong', 'review'].includes(resultFor(question, local))).length;
    });
    document.querySelector('[data-total-lessons]').textContent = data.lessonCount;
    document.querySelector('[data-total-questions]').textContent = data.questionCount;
    document.querySelector('[data-finished-lessons]').textContent = submitted;
    document.querySelector('[data-review-count]').textContent = reviewCount;
  };

  const renderLessonList = () => {
    const chapters = [];
    data.lessons.forEach((lesson) => {
      let chapter = chapters.find((item) => item.number === lesson.chapterNumber);
      if (!chapter) {
        chapter = { number: lesson.chapterNumber, title: lesson.chapterTitle, lessons: [] };
        chapters.push(chapter);
      }
      chapter.lessons.push(lesson);
    });
    lessonList.innerHTML = chapters.map((chapter) => `<section class="lesson-chapter">
      <h3>CH ${String(chapter.number).padStart(2, '0')} · ${escapeHtml(chapter.title)}</h3>
      ${chapter.lessons.map((lesson) => {
        const local = lessonState(lesson.number);
        const metrics = lessonMetrics(lesson, local);
        const score = local.submitted ? `${metrics.objectiveCorrect}/${metrics.objectiveCount}` : `${metrics.answered}/${lesson.questionCount}`;
        return `<button type="button" class="lesson-link ${lesson.number === state.currentLesson ? 'active' : ''}" data-lesson-number="${lesson.number}" data-search="${escapeHtml(`${lesson.number} ${lesson.title} ${lesson.documentTitle} ${chapter.title}`.toLocaleLowerCase('zh-CN'))}">
          <span class="lesson-no">${String(lesson.number).padStart(2, '0')}</span>
          <strong>${escapeHtml(lesson.title)}</strong>
          <span class="lesson-score">${score}</span>
        </button>`;
      }).join('')}
    </section>`).join('');
  };

  const renderCurrentLesson = () => {
    const lesson = lessonByNumber(state.currentLesson) || data.lessons[0];
    state.currentLesson = lesson.number;
    const local = lessonState(lesson.number);
    const metrics = lessonMetrics(lesson, local);
    const groupLabels = { A: 'A 组 · 基础练习', B: 'B 组 · 综合练习' };
    let currentGroup = '';
    const questions = lesson.questions.map((question) => {
      const divider = question.group !== currentGroup ? `<div class="group-divider">${groupLabels[question.group] || `${question.group} 组`}</div>` : '';
      currentGroup = question.group;
      return divider + renderQuestion(question, local);
    }).join('');

    heading.innerHTML = `<p class="eyebrow">LESSON ${String(lesson.number).padStart(2, '0')} / CH ${String(lesson.chapterNumber).padStart(2, '0')}</p>
      <h2>${escapeHtml(lesson.title)}</h2>
      <p>${escapeHtml(lesson.chapterTitle)} · 文档题目：${escapeHtml(lesson.documentTitle)}</p>
      <div class="lesson-badges"><span>${lesson.questionCount} 道题</span><span>${escapeHtml(lesson.duration)}</span><span>${local.submitted ? '已提交批阅' : '答案自动保存'}</span></div>`;
    questionList.innerHTML = questions;
    lessonActions.hidden = false;
    submitButton.hidden = local.submitted;
    filterButton.hidden = !local.submitted;
    retryButton.hidden = !local.submitted;
    filterButton.textContent = wrongOnly ? '显示全部题目' : '只看错题';
    prevButton.disabled = lesson.number === data.lessons[0].number;
    nextButton.disabled = lesson.number === data.lessons.at(-1).number;
    const percent = local.submitted
      ? Math.round(((metrics.objectiveCorrect + metrics.subjectiveMastered) / lesson.questionCount) * 100)
      : Math.round((metrics.answered / lesson.questionCount) * 100);
    progressLabel.textContent = local.submitted
      ? `掌握 ${metrics.objectiveCorrect + metrics.subjectiveMastered} / ${lesson.questionCount}`
      : `已答 ${metrics.answered} / ${lesson.questionCount}`;
    progressBar.style.width = `${percent}%`;
    renderResult(lesson, local);
    renderLessonList();
    renderGlobalStats();
    saveState();
  };

  const navigateTo = (number, shouldScroll = true) => {
    if (!lessonByNumber(number)) return;
    state.currentLesson = number;
    wrongOnly = false;
    history.replaceState(null, '', `#lesson-${String(number).padStart(2, '0')}`);
    renderCurrentLesson();
    if (shouldScroll) document.querySelector('#practice-main')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!data || !lessonList || !questionList) {
    if (questionList) questionList.innerHTML = '<p class="loading-note">题库读取失败，请重新生成 exercise-data.js。</p>';
    return;
  }

  const hashLesson = Number(location.hash.match(/lesson-(\d+)/u)?.[1]);
  if (hashLesson && lessonByNumber(hashLesson)) state.currentLesson = hashLesson;

  lessonList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-lesson-number]');
    if (button) navigateTo(Number(button.dataset.lessonNumber));
  });

  lessonSearch?.addEventListener('input', () => {
    const query = lessonSearch.value.trim().toLocaleLowerCase('zh-CN');
    lessonList.querySelectorAll('[data-lesson-number]').forEach((button) => {
      button.hidden = Boolean(query) && !button.dataset.search.includes(query);
    });
    lessonList.querySelectorAll('.lesson-chapter').forEach((chapter) => {
      chapter.hidden = ![...chapter.querySelectorAll('[data-lesson-number]')].some((button) => !button.hidden);
    });
  });

  questionList.addEventListener('input', (event) => {
    const input = event.target.closest('[data-answer-input]');
    if (!input) return;
    const lesson = lessonByNumber(state.currentLesson);
    const question = lesson.questions.find((item) => item.id === input.dataset.questionId);
    const local = lessonState(lesson.number);
    if (question.mode === 'multiple') {
      local.answers[question.id] = [...questionList.querySelectorAll(`input[data-question-id="${question.id}"]:checked`)].map((item) => item.value);
    } else {
      local.answers[question.id] = input.value;
    }
    saveState();
    const metrics = lessonMetrics(lesson, local);
    progressLabel.textContent = `已答 ${metrics.answered} / ${lesson.questionCount}`;
    progressBar.style.width = `${Math.round((metrics.answered / lesson.questionCount) * 100)}%`;
    renderLessonList();
  });

  questionList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-self-grade]');
    if (!button) return;
    const local = lessonState(state.currentLesson);
    local.selfGrades[button.dataset.questionId] = button.dataset.selfGrade;
    saveState();
    renderCurrentLesson();
    document.querySelector(`[data-question-card="${button.dataset.questionId}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  submitButton.addEventListener('click', () => {
    const lesson = lessonByNumber(state.currentLesson);
    const local = lessonState(lesson.number);
    const missing = lesson.questions.find((question) => !answerPresent(question, local));
    if (missing) {
      resultSummary.hidden = false;
      resultSummary.className = 'result-summary review';
      resultSummary.innerHTML = `<strong>还有题目没有作答。</strong><p>请完成第 ${missing.number} 题后再提交，本节答案已经保存在浏览器中。</p>`;
      document.querySelector(`[data-question-card="${missing.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    local.submitted = true;
    wrongOnly = false;
    saveState();
    renderCurrentLesson();
    resultSummary.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  filterButton.addEventListener('click', () => {
    wrongOnly = !wrongOnly;
    renderCurrentLesson();
  });

  retryButton.addEventListener('click', () => {
    const lesson = lessonByNumber(state.currentLesson);
    const local = lessonState(lesson.number);
    lesson.questions.forEach((question) => {
      const result = resultFor(question, local);
      if (['wrong', 'review', 'pending'].includes(result)) {
        delete local.answers[question.id];
        delete local.selfGrades[question.id];
      }
    });
    local.submitted = false;
    wrongOnly = false;
    saveState();
    renderCurrentLesson();
  });

  resetButton.addEventListener('click', () => {
    if (!window.confirm('清空本节全部答案和批阅结果？此操作无法撤销。')) return;
    state.lessons[String(state.currentLesson)] = { answers: {}, selfGrades: {}, submitted: false };
    wrongOnly = false;
    saveState();
    renderCurrentLesson();
  });

  prevButton.addEventListener('click', () => navigateTo(state.currentLesson - 1));
  nextButton.addEventListener('click', () => navigateTo(state.currentLesson + 1));

  renderCurrentLesson();
})();
