// Q5 — Rational function full analysis (20pt — biggest priority).
// 5-step walk: Domain -> Intercepts -> Asymptotes -> f' (sign chart) -> f'' (sign chart).
import { el, clear, dots, modeHead, mcqCard, finalBanner, methodPanel } from '../ui.js';
import { METHODS } from '../methods.js';
import { texFill } from '../katex-helper.js';
import { mulberry32, shuffle } from '../rng.js';

// Each problem is hand-verified. Sign-chart intervals listed in order; "+" or "-".
const BANK = [
  {
    fTex: 'f(x) = \\dfrac{x^{2}+1}{x^{2}-4}',
    domain: {
      choices: [
        { tex: 'x \\ne \\pm 2', correct: true,  why: 'Right — denominator x^2-4 = (x-2)(x+2) is zero at x = ±2.' },
        { tex: 'x \\ne 2',      correct: false, why: 'Missed x = -2; both roots of x^2-4 break the function.' },
        { tex: 'x \\ne 0',      correct: false, why: 'x = 0 is fine — denominator there is -4.' },
        { tex: '\\text{all real }x',    correct: false, why: 'Denominator vanishes at ±2 — not all reals.' },
      ],
    },
    intercepts: {
      ansTex: 'y\\text{-int: }\\left(0,-\\tfrac{1}{4}\\right);\\ \\text{no }x\\text{-int}',
      choices: [
        { tex: 'y\\text{-int }-\\tfrac{1}{4},\\ \\text{no }x\\text{-int}', correct: true,  why: 'f(0) = 1/(-4) = -1/4. Numerator x^2+1 is never 0 over reals.' },
        { tex: 'y\\text{-int }\\tfrac{1}{4},\\ x\\text{-int }(\\pm 1,0)',   correct: false, why: 'Sign on f(0) is wrong; and x^2+1 = 0 has no real roots.' },
        { tex: 'y\\text{-int }0,\\ x\\text{-int }(0,0)',                    correct: false, why: 'f(0) ≠ 0 and x = 0 is not a zero of x^2+1.' },
        { tex: '\\text{no intercepts at all}',                                       correct: false, why: 'There is a y-intercept at -1/4.' },
      ],
    },
    asymptotes: {
      ansTex: '\\text{VA: }x=\\pm 2;\\ \\text{HA: }y=1',
      choices: [
        { tex: '\\text{VA }x=\\pm 2,\\ \\text{HA }y=1', correct: true,  why: 'Numerator nonzero at ±2 → vertical. Equal degrees → HA = ratio of leading coefficients = 1.' },
        { tex: '\\text{VA }x=\\pm 2,\\ \\text{HA }y=0', correct: false, why: 'HA is 0 only when numerator degree < denominator degree.' },
        { tex: '\\text{VA }x=\\pm 2,\\ \\text{no HA}',  correct: false, why: 'Equal degrees always give a horizontal asymptote.' },
        { tex: '\\text{no VA, HA }y=1',                  correct: false, why: 'Denominator does vanish at ±2.' },
      ],
    },
    fPrime: {
      derivTex: "f'(x) = \\dfrac{-10x}{(x^{2}-4)^{2}}",
      derivWhy: 'Quotient rule: [2x(x^2-4) - (x^2+1)(2x)] / (x^2-4)^2 = (2x^3-8x-2x^3-2x)/(x^2-4)^2 = -10x/(x^2-4)^2.',
      cps: 'Critical at x = 0; undefined at x = ±2.',
      intervals: [
        { label: '(-\\infty, -2)', sign: '+' },
        { label: '(-2, 0)',        sign: '+' },
        { label: '(0, 2)',         sign: '-' },
        { label: '(2, \\infty)',   sign: '-' },
      ],
      conclusion: 'Increasing on (-∞,-2) and (-2,0); decreasing on (0,2) and (2,∞). Local max at x = 0, value -1/4.',
    },
    fDouble: {
      derivTex: "f''(x) = \\dfrac{10(3x^{2}+4)}{(x^{2}-4)^{3}}",
      derivWhy: "Differentiate -10x/(x^2-4)^2 again; numerator simplifies to 30x^2+40, denominator (x^2-4)^3.",
      cps: 'No real zeros (3x^2+4 > 0); undefined at x = ±2.',
      intervals: [
        { label: '(-\\infty, -2)', sign: '+' },
        { label: '(-2, 2)',        sign: '-' },
        { label: '(2, \\infty)',   sign: '+' },
      ],
      conclusion: 'Concave up on (-∞,-2) and (2,∞); concave down on (-2,2). No inflection (x = ±2 not in domain).',
    },
  },

  {
    fTex: 'f(x) = \\dfrac{x^{2}}{x^{2}-9}',
    domain: {
      choices: [
        { tex: 'x \\ne \\pm 3', correct: true,  why: 'Denominator x^2-9 = (x-3)(x+3) is zero at x = ±3.' },
        { tex: 'x \\ne 3',      correct: false, why: 'Missed x = -3.' },
        { tex: 'x \\ne 0',      correct: false, why: 'x = 0 makes the numerator 0, but the function is still defined there (value 0).' },
        { tex: '\\text{all real }x',    correct: false, why: 'x = ±3 are excluded.' },
      ],
    },
    intercepts: {
      ansTex: 'y\\text{-int }(0,0);\\ x\\text{-int }(0,0)',
      choices: [
        { tex: '\\text{both intercepts at }(0,0)', correct: true,  why: 'f(0) = 0 and the only zero of x^2 is x = 0.' },
        { tex: 'y\\text{-int }-\\tfrac{1}{9}', correct: false, why: 'f(0) = 0/(0-9) = 0, not -1/9.' },
        { tex: '\\text{no intercepts}',                correct: false, why: 'Both x and y intercepts exist at (0,0).' },
        { tex: 'x\\text{-ints at }\\pm 3',     correct: false, why: '±3 are excluded from the domain (they are vertical asymptotes).' },
      ],
    },
    asymptotes: {
      ansTex: '\\text{VA: }x=\\pm 3;\\ \\text{HA: }y=1',
      choices: [
        { tex: '\\text{VA }x=\\pm 3,\\ \\text{HA }y=1', correct: true,  why: 'Equal degrees, leading-coefficient ratio = 1/1.' },
        { tex: '\\text{VA }x=\\pm 3,\\ \\text{HA }y=0', correct: false, why: 'HA = 0 requires numerator degree < denominator degree.' },
        { tex: '\\text{VA only at }x=3',                 correct: false, why: 'Both ±3 are vertical asymptotes.' },
        { tex: '\\text{no VA, HA }y=1',                  correct: false, why: 'Denominator does vanish at ±3.' },
      ],
    },
    fPrime: {
      derivTex: "f'(x) = \\dfrac{-18x}{(x^{2}-9)^{2}}",
      derivWhy: 'Quotient rule: [2x(x^2-9) - x^2(2x)]/(x^2-9)^2 = -18x/(x^2-9)^2.',
      cps: 'Critical at x = 0; undefined at x = ±3.',
      intervals: [
        { label: '(-\\infty, -3)', sign: '+' },
        { label: '(-3, 0)',        sign: '+' },
        { label: '(0, 3)',         sign: '-' },
        { label: '(3, \\infty)',   sign: '-' },
      ],
      conclusion: 'Increasing on (-∞,-3) and (-3,0); decreasing on (0,3) and (3,∞). Local max at x = 0, value 0.',
    },
    fDouble: {
      derivTex: "f''(x) = \\dfrac{54(x^{2}+3)}{(x^{2}-9)^{3}}",
      derivWhy: 'Differentiate -18x/(x^2-9)^2; numerator simplifies to 54x^2+162.',
      cps: 'No real zeros; undefined at x = ±3.',
      intervals: [
        { label: '(-\\infty, -3)', sign: '+' },
        { label: '(-3, 3)',        sign: '-' },
        { label: '(3, \\infty)',   sign: '+' },
      ],
      conclusion: 'Concave up on (-∞,-3) and (3,∞); concave down on (-3,3). No inflection.',
    },
  },

  {
    fTex: 'f(x) = \\dfrac{x-1}{x^{2}-4}',
    domain: {
      choices: [
        { tex: 'x \\ne \\pm 2', correct: true,  why: 'Same denominator as before: ±2 break it.' },
        { tex: 'x \\ne 1',      correct: false, why: 'x = 1 makes the numerator zero, not the denominator — that gives an x-intercept.' },
        { tex: 'x \\ne 1, \\pm 2', correct: false, why: 'x = 1 is fine; the function value there is 0.' },
        { tex: '\\text{all real }x',    correct: false, why: '±2 are excluded.' },
      ],
    },
    intercepts: {
      ansTex: 'y\\text{-int }(0,\\tfrac{1}{4});\\ x\\text{-int }(1,0)',
      choices: [
        { tex: 'y\\text{-int }\\tfrac{1}{4},\\ x\\text{-int }1', correct: true,  why: 'f(0) = -1/-4 = 1/4. Numerator zero at x = 1.' },
        { tex: 'y\\text{-int }-\\tfrac{1}{4},\\ x\\text{-int }1', correct: false, why: 'Sign error: -1/-4 = +1/4.' },
        { tex: '\\text{no intercepts}',                                  correct: false, why: 'Both exist.' },
        { tex: 'x\\text{-int }-1',                                correct: false, why: 'Numerator x-1 is zero at +1, not -1.' },
      ],
    },
    asymptotes: {
      ansTex: '\\text{VA: }x=\\pm 2;\\ \\text{HA: }y=0',
      choices: [
        { tex: '\\text{VA }x=\\pm 2,\\ \\text{HA }y=0', correct: true,  why: 'Numerator degree 1 < denominator degree 2 → HA = 0.' },
        { tex: '\\text{VA }x=\\pm 2,\\ \\text{HA }y=1', correct: false, why: 'HA = 1 only if degrees match.' },
        { tex: '\\text{VA only at }x=2',                 correct: false, why: 'Both ±2 are VAs.' },
        { tex: '\\text{no VA}',                            correct: false, why: 'Denominator does vanish at ±2.' },
      ],
    },
    fPrime: {
      derivTex: "f'(x) = \\dfrac{-(x^{2}-2x+4)}{(x^{2}-4)^{2}}",
      derivWhy: 'Quotient rule: [(1)(x^2-4) - (x-1)(2x)]/(x^2-4)^2 = (x^2-4-2x^2+2x)/(x^2-4)^2 = -(x^2-2x+4)/(x^2-4)^2.',
      cps: 'No critical points: discriminant of x^2-2x+4 is 4-16 = -12 < 0, so the numerator is always negative. Undefined at x = ±2.',
      intervals: [
        { label: '(-\\infty, -2)', sign: '-' },
        { label: '(-2, 2)',        sign: '-' },
        { label: '(2, \\infty)',   sign: '-' },
      ],
      conclusion: 'Decreasing on the entire domain. No local extrema.',
    },
    fDouble: {
      derivTex: "f''(x) = \\dfrac{2(x^{3}-3x^{2}+12x-4)}{(x^{2}-4)^{3}}",
      derivWhy: 'Differentiate the f\' expression with the quotient rule and simplify (kept in factored form for sign analysis).',
      cps: 'Numerator has one real root near x ≈ 0.35; sign of f\'\' switches there and at x = ±2.',
      intervals: [
        { label: '(-\\infty, -2)', sign: '-' },
        { label: '(-2, 0.35)',     sign: '+' },
        { label: '(0.35, 2)',      sign: '-' },
        { label: '(2, \\infty)',   sign: '+' },
      ],
      conclusion: 'Concave up on (-2, 0.35) and (2, ∞); concave down on (-∞, -2) and (0.35, 2). Inflection near x ≈ 0.35.',
    },
  },
];

function signChartCard({ stepLabel, derivTex, derivWhy, cps, intervals, conclusion, onDone }) {
  const card = el('div', { class: 'card' });
  card.appendChild(el('div', { class: 'step-label', text: stepLabel }));
  card.appendChild(el('div', { class: 'expr-box', data: { tex: derivTex, display: '1' } }));
  card.appendChild(el('div', { class: 'feedback hint', text: derivWhy }));
  card.appendChild(el('div', { class: 'feedback hint', text: cps }));
  card.appendChild(el('div', { class: 'sub', text: 'Click + or − for each interval, then Check.' }));

  const grid = el('div', { class: 'sign-cells' });
  const picks = intervals.map(() => null);
  const cellRefs = [];
  intervals.forEach((iv, idx) => {
    const cell = el('div', { class: 'sign-cell' });
    cell.appendChild(el('div', { class: 'interval', data: { tex: iv.label } }));
    const picksRow = el('div', { class: 'picks' });
    const plus  = el('button', { type: 'button', text: '+' });
    const minus = el('button', { type: 'button', text: '−' });
    plus.addEventListener('click', () => {
      picks[idx] = '+';
      plus.classList.add('picked-pos'); minus.classList.remove('picked-neg');
    });
    minus.addEventListener('click', () => {
      picks[idx] = '-';
      minus.classList.add('picked-neg'); plus.classList.remove('picked-pos');
    });
    picksRow.appendChild(plus); picksRow.appendChild(minus);
    cell.appendChild(picksRow);
    cellRefs.push({ cell, plus, minus });
    grid.appendChild(cell);
  });
  card.appendChild(grid);

  const checkRow = el('div', { class: 'row' });
  const checkBtn = el('button', { class: 'btn', type: 'button', text: 'Check signs' });
  const nextBtn  = el('button', { class: 'btn alt', type: 'button', text: 'Next step', style: 'display:none' });
  checkRow.appendChild(checkBtn); checkRow.appendChild(nextBtn);
  card.appendChild(checkRow);

  let allRight = false;
  checkBtn.addEventListener('click', () => {
    if (picks.some((p) => p === null)) {
      const m = el('div', { class: 'feedback bad', text: 'Pick a sign for every interval first.' });
      card.appendChild(m); return;
    }
    allRight = picks.every((p, i) => p === intervals[i].sign);
    intervals.forEach((iv, i) => {
      const { cell, plus, minus } = cellRefs[i];
      const ok = picks[i] === iv.sign;
      cell.style.borderColor = ok ? 'var(--good-border)' : 'var(--bad-border)';
      cell.style.background  = ok ? 'var(--good-bg)' : 'var(--bad-bg)';
      plus.disabled = true; minus.disabled = true;
    });
    const fb = el('div', { class: 'feedback ' + (allRight ? 'good' : 'bad') });
    fb.textContent = allRight
      ? conclusion
      : 'Some signs off. Correct pattern: ' + intervals.map((iv) => `${iv.label.replace(/\\/g,'')}: ${iv.sign}`).join('  ·  ') + '.  ' + conclusion;
    card.appendChild(fb);
    checkBtn.disabled = true;
    nextBtn.style.display = '';
    onDone && onDone(allRight);
    setTimeout(() => texFill(card), 0);
  });
  nextBtn.addEventListener('click', () => {
    if (card._onNext) card._onNext(allRight);
  });

  setTimeout(() => texFill(card), 0);
  return card;
}

export function mount(view, ctx) {
  const TOTAL = 5;
  let stepIdx = 0;
  let perStep = [];
  const seed = (Date.now() & 0xffff);
  const order = shuffle(mulberry32(seed), BANK.map((_, i) => i));
  const probIdx = order[0];
  const P = BANK[probIdx];

  function head() {
    return modeHead({
      qLabel: 'Q5 · ★★★★★', title: 'Rational Function — Full Analysis',
      sub: 'Domain → intercepts → asymptotes → f′ sign chart → f′′ sign chart. 20 points on the exam.',
      score: { correct: ctx.score.correct, total: ctx.score.total },
    });
  }

  function record(correct) {
    const updated = ctx.recordStep('q5', correct);
    ctx.score.correct = updated.correct; ctx.score.total = updated.totalSteps;
    ctx.refreshScore();
    perStep[stepIdx] = correct ? 'done' : 'wrong';
  }

  function go(next) { stepIdx = next; render(); }

  function render() {
    clear(view);
    view.appendChild(head());
    view.appendChild(methodPanel('q5', METHODS.q5));
    view.appendChild(dots(TOTAL, stepIdx, perStep));
    view.appendChild(el('div', { class: 'card' }, [
      el('div', { class: 'step-label', text: 'Function under analysis' }),
      el('div', { class: 'expr-box', data: { tex: P.fTex, display: '1' } }),
    ]));
    setTimeout(() => texFill(view), 0);

    if (stepIdx === 0) {
      const c = mcqCard({
        stepLabel: 'Step 1 of 5  ·  Domain',
        promptTex: '\\text{For which }x\\text{ is }f\\text{ defined?}',
        problemTex: '',
        choices: P.domain.choices,
        onPick: (info) => {
          record(info.correct);
          const row = el('div', { class: 'row' });
          row.appendChild(el('button', { class: 'btn', text: 'Next step', onclick: () => go(1) }));
          c.appendChild(row);
        },
      });
      view.appendChild(c);
    } else if (stepIdx === 1) {
      const c = mcqCard({
        stepLabel: 'Step 2 of 5  ·  Intercepts',
        promptTex: '\\text{Find the }x\\text{- and }y\\text{-intercepts.}',
        problemTex: '',
        choices: P.intercepts.choices,
        onPick: (info) => {
          record(info.correct);
          c.appendChild(finalBanner({ ansTex: P.intercepts.ansTex }));
          const row = el('div', { class: 'row' });
          row.appendChild(el('button', { class: 'btn', text: 'Next step', onclick: () => go(2) }));
          c.appendChild(row);
        },
      });
      view.appendChild(c);
    } else if (stepIdx === 2) {
      const c = mcqCard({
        stepLabel: 'Step 3 of 5  ·  Asymptotes',
        promptTex: '\\text{List vertical and horizontal asymptotes.}',
        problemTex: '',
        choices: P.asymptotes.choices,
        onPick: (info) => {
          record(info.correct);
          c.appendChild(finalBanner({ ansTex: P.asymptotes.ansTex }));
          const row = el('div', { class: 'row' });
          row.appendChild(el('button', { class: 'btn', text: 'Next step', onclick: () => go(3) }));
          c.appendChild(row);
        },
      });
      view.appendChild(c);
    } else if (stepIdx === 3) {
      const card = signChartCard({
        stepLabel: "Step 4 of 5  ·  First derivative test",
        ...P.fPrime,
        onDone: (ok) => record(ok),
      });
      card._onNext = () => go(4);
      view.appendChild(card);
    } else if (stepIdx === 4) {
      const card = signChartCard({
        stepLabel: "Step 5 of 5  ·  Second derivative test",
        ...P.fDouble,
        onDone: (ok) => record(ok),
      });
      card._onNext = () => {
        ctx.recordProblemDone('q5');
        const row = el('div', { class: 'row' });
        row.appendChild(el('button', { class: 'btn', text: 'New function', onclick: () => window.location.reload() }));
        row.appendChild(el('button', { class: 'btn alt', text: 'Dashboard', onclick: () => window.location.reload() }));
        view.appendChild(row);
      };
      view.appendChild(card);
    }
  }

  render();
}
