// Reusable UI bits used by every mode.
import { texFill } from './katex-helper.js';

export function el(tag, attrs = {}, kids = []) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') n.className = v;
    else if (k === 'html') n.innerHTML = v;
    else if (k === 'text') n.textContent = v;
    else if (k.startsWith('on')) n.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'data') Object.entries(v).forEach(([dk, dv]) => n.dataset[dk] = dv);
    else n.setAttribute(k, v);
  }
  for (const c of [].concat(kids)) if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  return n;
}

export function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

export function dots(total, currentIdx, statuses = []) {
  // statuses[i] in {undefined, 'done', 'wrong'}
  const wrap = el('div', { class: 'dots' });
  for (let i = 0; i < total; i++) {
    const cls = ['dot'];
    if (statuses[i] === 'done') cls.push('done');
    if (statuses[i] === 'wrong') cls.push('wrong');
    if (i === currentIdx) cls.push('active');
    wrap.appendChild(el('div', { class: cls.join(' ') }));
  }
  return wrap;
}

export function modeHead({ qLabel, title, sub, score }) {
  const head = el('div', { class: 'mode-head' });
  const left = el('div', { class: 'left' }, [
    el('div', { class: 'crumb', text: qLabel }),
    el('h2', { text: title }),
    el('div', { class: 'sub', text: sub || '' }),
  ]);
  const right = el('div', { class: 'right' }, [
    el('div', { class: 'score-pill', text: `Score ${score.correct}/${score.total}` }),
  ]);
  head.appendChild(left); head.appendChild(right);
  return head;
}

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Render a step-card with a TeX prompt, MCQ choices, and feedback area.
// onPick(idx, choice, controls) is called when user picks.
// choices: [{ tex, label, correct, why }]
export function mcqCard({ stepLabel, promptTex, problemTex, choices, onPick }) {
  choices = shuffleInPlace(choices.slice());
  const card = el('div', { class: 'card' });
  card.appendChild(el('div', { class: 'step-label', text: stepLabel }));
  const p = el('div', { class: 'step-prompt', data: { tex: promptTex || '' } });
  if (promptTex) card.appendChild(p);
  if (problemTex) {
    card.appendChild(el('div', { class: 'expr-box', data: { tex: problemTex, display: '1' } }));
  }
  const grid = el('div', { class: 'choices' });
  const buttons = [];
  choices.forEach((c, i) => {
    const b = el('button', { class: 'choice', type: 'button' });
    if (c.tex) b.dataset.tex = c.tex;
    if (c.label) b.appendChild(document.createTextNode(c.label));
    b.addEventListener('click', () => {
      if (b.disabled) return;
      buttons.forEach((bb) => bb.disabled = true);
      const correct = !!c.correct;
      b.classList.add(correct ? 'correct' : 'wrong');
      if (!correct) {
        // also show the right one
        buttons.forEach((bb, ii) => { if (choices[ii].correct) bb.classList.add('correct'); });
      }
      onPick && onPick({ idx: i, correct, choice: c, card, advance: (ms = 1100) => setTimeout(() => onPick.next && onPick.next(), ms) });
      // feedback
      const fb = el('div', { class: 'feedback ' + (correct ? 'good' : 'bad') });
      fb.textContent = correct ? (c.why || 'Correct.') : (c.why || 'Not quite.');
      card.appendChild(fb);
      texFill(card);
    });
    grid.appendChild(b);
    buttons.push(b);
  });
  card.appendChild(grid);
  // Render TeX after mount
  setTimeout(() => texFill(card), 0);
  return card;
}

export function finalBanner({ ansTex, verifyText }) {
  const b = el('div', { class: 'final-banner' });
  b.appendChild(el('div', { class: 'label', text: 'Final answer' }));
  b.appendChild(el('div', { class: 'ans', data: { tex: ansTex, display: '1' } }));
  if (verifyText) b.appendChild(el('div', { class: 'verify', text: verifyText }));
  setTimeout(() => texFill(b), 0);
  return b;
}

export function nextRow({ onNext, onMore }) {
  const row = el('div', { class: 'row' });
  if (onNext) row.appendChild(el('button', { class: 'btn', text: 'Next problem', onclick: onNext }));
  if (onMore) row.appendChild(el('button', { class: 'btn alt', text: 'Give me more', onclick: onMore }));
  return row;
}

export function plainCard(html) {
  const c = el('div', { class: 'card', html });
  setTimeout(() => texFill(c), 0);
  return c;
}

// Interactive "Method" walkthrough — closed by default. Open it, click "Reveal step" to advance.
// method = { title, intro (HTML), steps: [{label, body (HTML)}], final (HTML) }
export function methodPanel(modeId, method) {
  const storeKey = `ma121:method:${modeId}`;
  const open = localStorage.getItem(storeKey) === '1';
  const card = el('div', { class: 'method-card' + (open ? ' open' : '') });
  const head = el('button', { class: 'method-head', type: 'button' });
  head.appendChild(el('span', { class: 'method-caret', text: open ? '▾' : '▸' }));
  head.appendChild(el('span', { class: 'method-title', text: 'Method walkthrough · ' + method.title }));
  head.appendChild(el('span', { class: 'method-hint', text: open ? '' : '(click to learn the concept)' }));
  const body = el('div', { class: 'method-body' });
  body.style.display = open ? '' : 'none';

  let revealed = 0;
  function renderBody() {
    body.innerHTML = '';
    const intro = el('div', { class: 'method-intro', html: '<b>Problem:</b> ' + method.intro });
    body.appendChild(intro);
    for (let i = 0; i < revealed; i++) {
      const s = method.steps[i];
      const stepEl = el('div', { class: 'method-step' });
      stepEl.appendChild(el('div', { class: 'method-step-label', text: s.label }));
      stepEl.appendChild(el('div', { class: 'method-step-body', html: s.body }));
      body.appendChild(stepEl);
    }
    const ctrl = el('div', { class: 'method-controls' });
    if (revealed < method.steps.length) {
      const btn = el('button', { class: 'btn', type: 'button', text: revealed === 0 ? 'Reveal step 1' : `Reveal step ${revealed + 1}` });
      btn.addEventListener('click', () => { revealed += 1; renderBody(); });
      ctrl.appendChild(btn);
      const skip = el('button', { class: 'btn alt', type: 'button', text: 'Show all' });
      skip.addEventListener('click', () => { revealed = method.steps.length; renderBody(); });
      ctrl.appendChild(skip);
    } else {
      ctrl.appendChild(el('div', { class: 'method-final', html: method.final }));
      const reset = el('button', { class: 'btn alt', type: 'button', text: 'Restart walkthrough' });
      reset.addEventListener('click', () => { revealed = 0; renderBody(); });
      ctrl.appendChild(reset);
    }
    body.appendChild(ctrl);
    texFill(body);
  }

  head.addEventListener('click', () => {
    const nowOpen = body.style.display === 'none';
    body.style.display = nowOpen ? '' : 'none';
    card.classList.toggle('open', nowOpen);
    head.firstChild.textContent = nowOpen ? '▾' : '▸';
    head.querySelector('.method-hint').textContent = nowOpen ? '' : '(click to learn the concept)';
    localStorage.setItem(storeKey, nowOpen ? '1' : '0');
    if (nowOpen && revealed === 0) renderBody();
    else if (nowOpen) texFill(body);
  });
  card.appendChild(head);
  card.appendChild(body);
  if (open) renderBody();
  return card;
}
