const tabList = document.querySelector("[data-demo-tabs]");
const tabs = [...tabList.querySelectorAll("button")];
const panels = tabs.map(tab => document.getElementById(tab.getAttribute("aria-controls")));

tabList.setAttribute("role", "tablist");
tabList.setAttribute("aria-label", "软件功能");
tabs.forEach((tab, index) => {
  tab.setAttribute("role", "tab");
  panels[index].setAttribute("role", "tabpanel");
  panels[index].setAttribute("aria-labelledby", tab.id);
});

function selectTab(selectedIndex) {
  tabs.forEach((tab, index) => {
    const selected = index === selectedIndex;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    panels[index].hidden = !selected;
  });
}

tabList.addEventListener("click", event => {
  const tab = event.target.closest('[role="tab"]');
  if (tab) selectTab(tabs.indexOf(tab));
});

tabList.addEventListener("keydown", event => {
  const current = tabs.indexOf(event.target);
  if (current < 0) return;
  const last = tabs.length - 1;
  let next;

  switch (event.key) {
    case "ArrowRight": next = current === last ? 0 : current + 1; break;
    case "ArrowLeft": next = current === 0 ? last : current - 1; break;
    case "Home": next = 0; break;
    case "End": next = last; break;
    default: return;
  }

  event.preventDefault();
  selectTab(next);
  tabs[next].focus();
});

selectTab(0);
tabList.hidden = false;

const example = document.querySelector("[data-memory-example]");
const elapsedInput = example.querySelector("#days-elapsed");
const rehearsedInput = example.querySelector("#rehearsed");
const decay = 0.1542;
const targetRecall = 0.9;
const forgettingFactor = targetRecall ** (-1 / decay) - 1;

function recall(stability, elapsedDays) {
  return (1 + forgettingFactor * elapsedDays / stability) ** -decay;
}

function percent(ratio) {
  return `${Math.round(ratio * 100)}%`;
}

function updateMemoryExample() {
  const days = Number(elapsedInput.value);
  const reviewedLarva = rehearsedInput.checked;
  const adultRecall = recall(21, days);
  const larvaRecall = reviewedLarva ? 1 : recall(4, days);
  const larvaScore = reviewedLarva ? 1 : 0.5;
  const adultContribution = 0.6 * adultRecall;
  const larvaContribution = 0.4 * larvaScore * larvaRecall;

  example.querySelector("[data-memory-days]").textContent = `${days} 天`;
  example.querySelector("[data-adult-recall]").textContent = percent(adultRecall);
  example.querySelector("[data-larva-score]").textContent = percent(larvaScore);
  example.querySelector("[data-larva-recall]").textContent = percent(larvaRecall);
  example.querySelector("[data-total-mastery]").textContent = percent(adultContribution + larvaContribution);
  example.querySelector("[data-adult-bar]").style.width = `${adultContribution * 100}%`;
  example.querySelector("[data-larva-bar]").style.width = `${larvaContribution * 100}%`;

  const decision = example.querySelector("[data-review-decision]");
  if (!reviewedLarva) {
    decision.textContent = "幼虫形态有未掌握的要点，优先安排复习。";
  } else if (adultRecall < targetRecall) {
    decision.textContent = "幼虫小问已补练。成虫小问的回忆概率低于目标，接下来可以复习成虫。";
  } else {
    decision.textContent = "幼虫小问已补练。成虫的回忆概率仍在目标范围内，继续按原间隔安排。";
  }
}

elapsedInput.addEventListener("input", updateMemoryExample);
rehearsedInput.addEventListener("change", updateMemoryExample);
updateMemoryExample();
example.querySelector("[data-memory-controls]").hidden = false;

