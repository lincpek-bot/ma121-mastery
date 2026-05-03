// Q8 — Definite integrals (FTC), properties, u-sub on definite integrals, average value.
import { el, clear, dots, modeHead, mcqCard } from '../ui.js';
import { mulberry32, shuffle } from '../rng.js';

const BANK = [
  { f: '\\int_{0}^{1} x^{2}\\,dx', why: 'FTC: x^3/3 from 0 to 1 = 1/3.',
    choices: ['\\tfrac{1}{3}', '1', '\\tfrac{1}{2}', '\\tfrac{2}{3}'], correctIdx: 0,
    explain: ['Correct.','Forgot the antiderivative.','Used /2 instead of /3.','Off by a factor of 2.'] },

  { f: '\\int_{1}^{3} (2x+1)\\,dx', why: 'Antideriv x^2+x. (9+3)-(1+1)=10.',
    choices: ['8', '10', '12', '6'], correctIdx: 1,
    explain: ['Forgot the +1 term.','Correct.','Forgot to subtract the lower bound.','Bounds swapped.'] },

  { f: '\\int_{0}^{2} e^{x}\\,dx', why: 'Antideriv e^x. e^2 - e^0 = e^2 - 1.',
    choices: ['e^{2}', 'e^{2}-1', 'e^{2}+1', '2e'], correctIdx: 1,
    explain: ['Forgot the lower bound.','Correct.','Sign error.','Power rule on e^x — wrong.'] },

  { f: '\\int_{1}^{e} \\dfrac{1}{x}\\,dx', why: 'Antideriv ln x. ln e - ln 1 = 1.',
    choices: ['1', 'e-1', '\\ln(e-1)', '0'], correctIdx: 0,
    explain: ['Correct.','That is ∫ 1 dx, not 1/x.','Logarithm of a difference — wrong rule.','Forgot ln 1 = 0 still leaves ln e = 1.'] },

  { f: '\\int_{-1}^{1} x^{3}\\,dx', why: 'x^3 is odd; integral over symmetric interval is 0.',
    choices: ['0', '\\tfrac{1}{2}', '\\tfrac{1}{4}', '2'], correctIdx: 0,
    explain: ['Correct — odd function on a symmetric interval.','Forgot symmetry.','Same.','No.'] },

  { f: '\\int_{0}^{1} 2x(x^{2}+1)^{3}\\,dx', why: 'u-sub: u=x^2+1, du=2x dx. From u=1 to u=2: ∫u^3 du = (u^4/4)|_1^2 = (16-1)/4 = 15/4.',
    choices: ['\\tfrac{15}{4}', '\\tfrac{1}{4}', '4', '\\tfrac{16}{4}'], correctIdx: 0,
    explain: ['Correct.','Forgot the lower bound contribution.','Lost the /4.','Forgot to subtract.'] },

  { f: '\\int_{0}^{2} (3x^{2}+2)\\,dx', why: 'Antideriv x^3+2x. (8+4)-0 = 12.',
    choices: ['10', '12', '14', '8'], correctIdx: 1,
    explain: ['Forgot the +2x term.','Correct.','Off by 2.','Forgot the constant.'] },

  { f: '\\int_{1}^{4} \\sqrt{x}\\,dx', why: 'Antideriv (2/3)x^{3/2}. (2/3)(8-1) = 14/3.',
    choices: ['\\tfrac{14}{3}', '\\tfrac{7}{3}', '\\tfrac{16}{3}', '\\tfrac{2}{3}\\cdot 4'], correctIdx: 0,
    explain: ['Correct.','Forgot a factor of 2.','Used /2 instead of /3.','Forgot the lower bound.'] },

  { f: '\\text{If }\\int_{1}^{3} f(x)\\,dx = 5,\\ \\text{find }\\int_{3}^{1} f(x)\\,dx', why: 'Reversing limits flips sign.',
    choices: ['5', '-5', '0', '10'], correctIdx: 1,
    explain: ['Forgot the sign flip.','Correct — reversed limits negate.','No.','That would be doubling, not flipping.'] },

  { f: '\\text{If }\\int_{0}^{2} f = 4\\ \\text{and}\\ \\int_{2}^{5} f = 7,\\ \\text{find }\\int_{0}^{5} f', why: 'Additivity over adjacent intervals.',
    choices: ['11', '3', '28', '-3'], correctIdx: 0,
    explain: ['Correct — split at x=2.','Subtracted instead of added.','Multiplied — wrong.','Sign wrong.'] },

  { f: '\\text{Avg value of }f(x) = x^{2}\\ \\text{on }[0,3]', why: 'f_avg = (1/(b-a))∫f dx = (1/3)·9 = 3.',
    choices: ['3', '9', '\\tfrac{1}{3}', '27'], correctIdx: 0,
    explain: ['Correct.','That is the integral, not the average.','Inverted.','Cubed by mistake.'] },

  { f: '\\text{Avg value of }f(x) = 2x+1\\ \\text{on }[0,4]', why: '(1/4)·∫_0^4 (2x+1) dx = (1/4)·(16+4) = 5.',
    choices: ['5', '4', '20', '\\tfrac{1}{2}'], correctIdx: 0,
    explain: ['Correct.','Forgot the +1 contribution.','Forgot to divide by (b-a).','Inverted.'] },

  { f: '\\int_{0}^{2} (x^{2} - x)\\,dx', why: 'Antideriv x^3/3 - x^2/2. (8/3 - 2) - 0 = 2/3.',
    choices: ['\\tfrac{2}{3}', '\\tfrac{1}{3}', '\\tfrac{4}{3}', '0'], correctIdx: 0,
    explain: ['Correct.','Computed only one term.','Doubled.','Sign error somewhere.'] },

  { f: '\\text{Avg value of }f(x) = e^{x}\\ \\text{on }[0,\\ln 2]', why: '(1/ln2)·(e^{ln2} - 1) = (1/ln2)·1 = 1/ln 2.',
    choices: ['\\dfrac{1}{\\ln 2}', '\\ln 2', '2-1', '\\dfrac{2}{\\ln 2}'], correctIdx: 0,
    explain: ['Correct.','Inverted.','That is just the integral, not divided.','Off by a factor of 2.'] },
];

export function mount(view, ctx) {
  const TOTAL = 5;
  let stepIdx = 0;
  let perStep = [];
  const seed = (Date.now() & 0xffff);
  const order = shuffle(mulberry32(seed), BANK.map((_, i) => i));

  function render() {
    clear(view);
    view.appendChild(modeHead({
      qLabel: 'Q8 · ★★★★', title: 'FTC + Average Value',
      sub: 'Definite integrals, properties (reversal/additivity), u-sub with bounds, average value.',
      score: { correct: ctx.score.correct, total: ctx.score.total },
    }));
    view.appendChild(dots(TOTAL, stepIdx, perStep));

    const probIdx = order[stepIdx % order.length];
    const p = BANK[probIdx];
    const card = mcqCard({
      stepLabel: `Step ${stepIdx + 1} of ${TOTAL}  ·  Evaluate`,
      promptTex: '',
      problemTex: p.f,
      choices: p.choices.map((c, i) => ({
        tex: c, correct: i === p.correctIdx, why: p.explain[i],
      })),
      onPick: (info) => {
        const updated = ctx.recordStep('q8', info.correct);
        ctx.score.correct = updated.correct; ctx.score.total = updated.totalSteps;
        ctx.refreshScore();
        perStep[stepIdx] = info.correct ? 'done' : 'wrong';
        const row = el('div', { class: 'row' });
        if (stepIdx + 1 < TOTAL) {
          row.appendChild(el('button', { class: 'btn', text: 'Next', onclick: () => { stepIdx += 1; render(); } }));
        } else {
          ctx.recordProblemDone('q8');
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
