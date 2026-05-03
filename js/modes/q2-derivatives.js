// Q2 — Derivatives MCQ. Hand-verified bank covering all rules + the "constant trap".
import { el, clear, dots, modeHead, mcqCard } from '../ui.js';
import { mulberry32, shuffle } from '../rng.js';

// Each problem: f(x) (TeX), 4 choices, one correct.
const BANK = [
  // CONSTANT TRAPS — derivative is 0
  { f: 'f(x) = e^{4}', why: 'e^4 is just a number. Derivative of any constant is 0.',
    choices: ['0', 'e^{4}', '4e^{3}', '4e^{4}'], correctIdx: 0,
    explain: ['Yes — e^4 is a constant.','That would be d/dx[e^x] at x=4, which is not what the question asks.','Power-rule misread of an exponential constant.','Mixing exponential and power rules on a constant.'] },
  { f: 'f(x) = \\sqrt{e}', why: 'sqrt(e) is just e^{1/2}, a constant.',
    choices: ['\\dfrac{1}{2\\sqrt{e}}', '\\sqrt{e}', '0', '\\dfrac{1}{2}e^{-1/2}\\cdot e'], correctIdx: 2,
    explain: ['You differentiated as if x = e — it’s a constant.','The function is constant; derivative is not itself.','Correct — sqrt(e) is a constant.','Same trap as A — chain rule on a constant.'] },
  { f: 'f(x) = \\ln(5)', why: 'ln(5) is a constant.',
    choices: ['\\dfrac{1}{5}', '\\dfrac{1}{x}', '0', '5'], correctIdx: 2,
    explain: ['1/5 would be ln(x) at x=5, but ln(5) itself is constant.','Wrong — there is no x in ln(5).','Correct — ln(5) is a constant, derivative 0.','No.'] },

  // POWER RULE
  { f: 'f(x) = x^{e+1}', why: 'Exponent e+1 is a constant; pure power rule.',
    choices: ['(e+1)x^{e}', 'x^{e+1}\\ln x', '(e+1)x^{e+1}', 'e \\cdot x^{e}'], correctIdx: 0,
    explain: ['Correct — power rule with constant exponent e+1.','That would be the exponential pattern; here the variable is the base.','Forgot to subtract 1 from the exponent.','Dropped the +1 from the exponent.'] },
  { f: 'f(x) = \\dfrac{1}{\\sqrt{x}}', why: 'Rewrite as x^{-1/2}, then power rule.',
    choices: ['-\\dfrac{1}{2}x^{-3/2}', '\\dfrac{1}{2}x^{-1/2}', '-\\dfrac{1}{x^{2}}', '-\\dfrac{1}{2x^{3/2}} \\text{ (different form)}'], correctIdx: 0,
    explain: ['Yes — d/dx[x^{-1/2}] = -1/2 · x^{-3/2}.','Sign and exponent both wrong.','That is d/dx[1/x].','Equivalent to A in value, but A is the canonical form for this drill.'] },

  // EXPONENTIAL
  { f: 'f(x) = e^{3x}', why: 'Chain rule on e^{kx}: e^{kx}·k.',
    choices: ['3e^{3x}', 'e^{3x}', 'e^{3}', '3xe^{3x-1}'], correctIdx: 0,
    explain: ['Correct — chain rule gives the inner derivative 3.','Forgot the chain-rule factor.','Treating e^{3x} as a constant.','Power rule on an exponential — wrong rule.'] },
  { f: 'f(x) = 2^{x}', why: 'b^x rule: b^x · ln(b).',
    choices: ['2^{x}', '2^{x}\\ln 2', 'x\\cdot 2^{x-1}', '\\dfrac{2^{x}}{\\ln 2}'], correctIdx: 1,
    explain: ['That’s d/dx[e^x] applied incorrectly.','Correct — general exponential rule.','Power rule misapplied to an exponential.','Confusing derivative with antiderivative form.'] },

  // LOGARITHM
  { f: 'f(x) = \\ln(x^{2}+1)', why: 'Chain on ln: f\'(x)/f(x).',
    choices: ['\\dfrac{1}{x^{2}+1}', '\\dfrac{2x}{x^{2}+1}', '\\dfrac{2x}{x}', '2x\\ln(x^{2}+1)'], correctIdx: 1,
    explain: ['Forgot the inner derivative 2x.','Correct — (2x)/(x^2+1).','Cancelation mistake.','Wrong rule entirely.'] },
  { f: 'f(x) = \\log_{3}(x)', why: 'log_b(x) derivative is 1/(x ln b).',
    choices: ['\\dfrac{1}{x\\ln 3}', '\\dfrac{1}{x}', '\\dfrac{\\ln 3}{x}', '\\dfrac{1}{3x}'], correctIdx: 0,
    explain: ['Correct — base-change formula: 1/(x ln b).','That’s the natural log derivative.','Inverted ln(b) — should be in the denominator.','Mistakenly used base inside denominator.'] },

  // CHAIN RULE
  { f: 'f(x) = (2x+1)^{4}', why: 'Power × chain rule.',
    choices: ['4(2x+1)^{3}', '8(2x+1)^{3}', '(2x+1)^{3}', '4(2x+1)^{3}\\cdot 2x'], correctIdx: 1,
    explain: ['Forgot the inner derivative — needs ×2.','Correct: 4(2x+1)^3 · 2.','Forgot the outer power-rule constant 4.','Inner derivative is 2, not 2x.'] },

  // PRODUCT RULE
  { f: 'f(x) = x^{2}\\ln x', why: 'Product rule needed: f\'g + fg\'.',
    choices: ['2x \\cdot \\dfrac{1}{x}', '2x\\ln x + x', '2x\\ln x + x^{2}\\cdot\\dfrac{1}{x}', '2x\\ln x'], correctIdx: 2,
    explain: ['That is multiplying derivatives — not the product rule.','Computational shortcut that drops a step. Try the full form first.','Correct (and equals 2x ln x + x).','Forgot the second term entirely.'] },
  { f: 'f(x) = e^{x}\\sqrt{x}', why: 'Product rule + power rule on sqrt.',
    choices: ['e^{x}\\sqrt{x} + e^{x}\\cdot \\dfrac{1}{2\\sqrt{x}}', 'e^{x}\\cdot \\dfrac{1}{2\\sqrt{x}}', 'e^{x}\\sqrt{x}', 'e^{x}\\cdot \\dfrac{1}{2}x^{-1/2} + \\sqrt{x}'], correctIdx: 0,
    explain: ['Correct — full product rule.','Missed the term where you differentiate e^x.','Treating one factor as constant.','Lost the e^x factor in second term.'] },

  // QUOTIENT RULE
  { f: 'f(x) = \\dfrac{x}{x+1}', why: 'Quotient rule: (low·dHigh − high·dLow)/low².',
    choices: ['\\dfrac{1}{(x+1)^{2}}', '\\dfrac{x}{(x+1)^{2}}', '\\dfrac{(x+1)-x}{(x+1)^{2}}', '\\dfrac{1}{x+1}'], correctIdx: 0,
    explain: ['Correct — simplifies to 1/(x+1)^2.','Sign or numerator error.','Right idea, but unsimplified — final value is option A.','Skipped the quotient rule.'] },

  // CHAIN ON EXP
  { f: 'f(x) = e^{x^{2}}', why: 'Chain rule on e^{u}: e^{u}·u\'.',
    choices: ['2x e^{x^{2}}', 'e^{x^{2}}', '2x e^{2x}', 'e^{2x}'], correctIdx: 0,
    explain: ['Correct.','Forgot the inner derivative 2x.','Mishandled both base and exponent.','Wrong derivative form entirely.'] },

  // CHAIN ON LN with product
  { f: 'f(x) = \\ln(\\sqrt{x})', why: 'Simplify first: ln(sqrt x) = (1/2) ln x.',
    choices: ['\\dfrac{1}{2x}', '\\dfrac{1}{\\sqrt{x}}', '\\dfrac{1}{x}', '\\dfrac{1}{2\\sqrt{x}}'], correctIdx: 0,
    explain: ['Correct — derivative of (1/2)ln x is 1/(2x).','Confusing the function with its inner part.','That ignored the 1/2.','You differentiated the inside but kept it outside the log.'] },
];

export function mount(view, ctx) {
  const TOTAL = 5; // 5-step session per round
  let stepIdx = 0;
  let perStep = [];
  const seed = (Date.now() & 0xffff);
  const order = shuffle(mulberry32(seed), BANK.map((_, i) => i));

  function render() {
    clear(view);
    view.appendChild(modeHead({
      qLabel: 'Q2 · ★★', title: 'Derivatives',
      sub: 'Power, exponential, logarithm, chain, product, quotient — and the constant trap.',
      score: { correct: ctx.score.correct, total: ctx.score.total },
    }));
    view.appendChild(dots(TOTAL, stepIdx, perStep));

    const probIdx = order[stepIdx % order.length];
    const p = BANK[probIdx];
    const card = mcqCard({
      stepLabel: `Step ${stepIdx + 1} of ${TOTAL}  ·  Find f'(x)`,
      promptTex: '',
      problemTex: p.f,
      choices: p.choices.map((c, i) => ({
        tex: c, correct: i === p.correctIdx, why: p.explain[i],
      })),
      onPick: (info) => {
        const updated = ctx.recordStep('q2', info.correct);
        ctx.score.correct = updated.correct; ctx.score.total = updated.totalSteps;
        ctx.refreshScore();
        perStep[stepIdx] = info.correct ? 'done' : 'wrong';
        const row = el('div', { class: 'row' });
        if (stepIdx + 1 < TOTAL) {
          row.appendChild(el('button', { class: 'btn', text: 'Next', onclick: () => { stepIdx += 1; render(); } }));
        } else {
          ctx.recordProblemDone('q2');
          row.appendChild(el('button', { class: 'btn', text: 'Round again', onclick: () => { stepIdx = 0; perStep = []; render(); } }));
          row.appendChild(el('button', { class: 'btn alt', text: 'Dashboard', onclick: () => window.location.reload() }));
        }
        card.appendChild(row);
      },
    });
    view.appendChild(card);
  }
  render();
}
