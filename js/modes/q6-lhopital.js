// Q6 — L'Hôpital's Rule. 3-step flow per problem: verify form, differentiate top/bottom, evaluate.
import { el, clear, dots, modeHead, mcqCard, finalBanner, methodPanel } from '../ui.js';
import { METHODS } from '../methods.js';
import { texFill } from '../katex-helper.js';
import { mulberry32, shuffle } from '../rng.js';

const BANK = [
  {
    limTex: '\\lim_{x\\to 0}\\dfrac{\\sin x}{x}',
    formChoices: [
      { tex: '\\tfrac{0}{0}', correct: true,  why: 'sin(0)=0 and the denominator is 0 — indeterminate 0/0.' },
      { tex: '\\tfrac{\\infty}{\\infty}', correct: false, why: 'Neither piece blows up at 0.' },
      { tex: '\\text{not indeterminate}', correct: false, why: 'It is — both top and bottom hit 0.' },
      { tex: '0\\cdot\\infty', correct: false, why: 'That is a different indeterminate form.' },
    ],
    diffTex: '\\dfrac{d/dx[\\sin x]}{d/dx[x]} = \\dfrac{\\cos x}{1}',
    evalChoices: [
      { tex: '1',   correct: true,  why: 'cos(0)/1 = 1.' },
      { tex: '0',   correct: false, why: 'cos(0) = 1, not 0.' },
      { tex: '\\infty', correct: false, why: 'Limit is finite.' },
      { tex: '\\text{DNE}', correct: false, why: 'Limit exists and equals 1.' },
    ],
    answerTex: '\\lim_{x\\to 0}\\dfrac{\\sin x}{x} = 1',
  },
  {
    limTex: '\\lim_{x\\to\\infty}\\dfrac{\\ln x}{x}',
    formChoices: [
      { tex: '\\tfrac{\\infty}{\\infty}', correct: true,  why: 'ln x → ∞ and x → ∞.' },
      { tex: '\\tfrac{0}{0}', correct: false, why: 'Neither piece is 0 at infinity.' },
      { tex: '\\text{not indeterminate}', correct: false, why: 'Both top and bottom diverge — that is indeterminate ∞/∞.' },
      { tex: '1^\\infty', correct: false, why: 'That form is for limits like (1+1/x)^x.' },
    ],
    diffTex: '\\dfrac{d/dx[\\ln x]}{d/dx[x]} = \\dfrac{1/x}{1}',
    evalChoices: [
      { tex: '0',   correct: true,  why: '1/x → 0 as x → ∞.' },
      { tex: '1',   correct: false, why: '1/x shrinks to 0, not 1.' },
      { tex: '\\infty', correct: false, why: 'Opposite — 1/x decays.' },
      { tex: '\\text{DNE}', correct: false, why: 'Limit exists and is 0.' },
    ],
    answerTex: '\\lim_{x\\to\\infty}\\dfrac{\\ln x}{x} = 0',
  },
  {
    limTex: '\\lim_{x\\to 0}\\dfrac{e^{x}-1}{x}',
    formChoices: [
      { tex: '\\tfrac{0}{0}', correct: true,  why: 'e^0 - 1 = 0 and denominator 0.' },
      { tex: '\\tfrac{\\infty}{\\infty}', correct: false, why: 'Both finite at 0.' },
      { tex: '\\text{not indeterminate}', correct: false, why: 'Both 0 — indeterminate.' },
      { tex: '0^0', correct: false, why: 'Wrong form.' },
    ],
    diffTex: '\\dfrac{d/dx[e^{x}-1]}{d/dx[x]} = \\dfrac{e^{x}}{1}',
    evalChoices: [
      { tex: '1',   correct: true,  why: 'e^0 = 1.' },
      { tex: '0',   correct: false, why: 'e^0 = 1, not 0.' },
      { tex: 'e',   correct: false, why: 'Limit is at 0, not 1.' },
      { tex: '\\text{DNE}', correct: false, why: 'Equals 1.' },
    ],
    answerTex: '\\lim_{x\\to 0}\\dfrac{e^{x}-1}{x} = 1',
  },
  {
    limTex: '\\lim_{x\\to\\infty}\\dfrac{x^{2}}{e^{x}}',
    formChoices: [
      { tex: '\\tfrac{\\infty}{\\infty}', correct: true,  why: 'Polynomial vs. exponential — both diverge.' },
      { tex: '\\tfrac{0}{0}', correct: false, why: 'Neither is 0 at infinity.' },
      { tex: '\\text{not indeterminate}', correct: false, why: 'Both diverge — apply L\'Hôpital.' },
      { tex: '\\infty - \\infty', correct: false, why: 'It is a quotient, not a difference.' },
    ],
    diffTex: '\\dfrac{2x}{e^{x}}\\ \\xrightarrow{\\text{still }\\infty/\\infty}\\ \\dfrac{2}{e^{x}}',
    evalChoices: [
      { tex: '0',   correct: true,  why: 'After two applications: 2/e^x → 0. Exponentials beat polynomials.' },
      { tex: '\\infty', correct: false, why: 'e^x grows much faster than x^2.' },
      { tex: '1',   correct: false, why: 'Not a finite nonzero value.' },
      { tex: '2',   correct: false, why: 'Did not finish — 2/e^x still → 0.' },
    ],
    answerTex: '\\lim_{x\\to\\infty}\\dfrac{x^{2}}{e^{x}} = 0',
  },
  {
    limTex: '\\lim_{x\\to 1}\\dfrac{\\ln x}{x-1}',
    formChoices: [
      { tex: '\\tfrac{0}{0}', correct: true,  why: 'ln(1)=0 and 1-1=0.' },
      { tex: '\\tfrac{\\infty}{\\infty}', correct: false, why: 'At x=1 both are 0, not infinite.' },
      { tex: '\\text{not indeterminate}', correct: false, why: 'It is 0/0.' },
      { tex: '\\infty\\cdot 0', correct: false, why: 'Wrong form.' },
    ],
    diffTex: '\\dfrac{d/dx[\\ln x]}{d/dx[x-1]} = \\dfrac{1/x}{1}',
    evalChoices: [
      { tex: '1',   correct: true,  why: '1/1 = 1.' },
      { tex: '0',   correct: false, why: '1/x at x=1 is 1, not 0.' },
      { tex: '\\infty', correct: false, why: 'Finite.' },
      { tex: '\\text{DNE}', correct: false, why: 'Equals 1.' },
    ],
    answerTex: '\\lim_{x\\to 1}\\dfrac{\\ln x}{x-1} = 1',
  },
  {
    limTex: '\\lim_{x\\to 0}\\dfrac{1-\\cos x}{x^{2}}',
    formChoices: [
      { tex: '\\tfrac{0}{0}', correct: true,  why: '1-cos 0 = 0, x^2 = 0.' },
      { tex: '\\tfrac{\\infty}{\\infty}', correct: false, why: 'Both finite at 0.' },
      { tex: '\\text{not indeterminate}', correct: false, why: '0/0 — indeterminate.' },
      { tex: '0^0', correct: false, why: 'Wrong form.' },
    ],
    diffTex: '\\dfrac{\\sin x}{2x}\\ \\xrightarrow{0/0}\\ \\dfrac{\\cos x}{2}',
    evalChoices: [
      { tex: '\\tfrac{1}{2}', correct: true,  why: 'After two L\'Hôpitals: cos(0)/2 = 1/2.' },
      { tex: '1',   correct: false, why: 'You stopped one step early or forgot the 2.' },
      { tex: '0',   correct: false, why: 'cos(0) = 1, not 0.' },
      { tex: '2',   correct: false, why: 'Inverted the 2.' },
    ],
    answerTex: '\\lim_{x\\to 0}\\dfrac{1-\\cos x}{x^{2}} = \\dfrac{1}{2}',
  },
];

export function mount(view, ctx) {
  const TOTAL = 5;
  let stepIdx = 0;
  let perStep = [];
  const seed = (Date.now() & 0xffff);
  const order = shuffle(mulberry32(seed), BANK.map((_, i) => i));

  function head() {
    return modeHead({
      qLabel: "Q6 · ★★★", title: "L'Hôpital's Rule",
      sub: 'Verify form first. Then differentiate top and bottom separately. Repeat if still indeterminate.',
      score: { correct: ctx.score.correct, total: ctx.score.total },
    });
  }

  function record(correct) {
    const updated = ctx.recordStep('q6', correct);
    ctx.score.correct = updated.correct; ctx.score.total = updated.totalSteps;
    ctx.refreshScore();
    perStep[stepIdx] = correct ? 'done' : 'wrong';
  }

  function render() {
    clear(view);
    view.appendChild(head());
    view.appendChild(methodPanel('q6', METHODS.q6.title, METHODS.q6.body));
    view.appendChild(dots(TOTAL, stepIdx, perStep));

    const probIdx = order[stepIdx % order.length];
    const P = BANK[probIdx];

    view.appendChild(el('div', { class: 'card' }, [
      el('div', { class: 'step-label', text: `Step ${stepIdx + 1} of ${TOTAL}  ·  Limit` }),
      el('div', { class: 'expr-box', data: { tex: P.limTex, display: '1' } }),
    ]));

    const c1 = mcqCard({
      stepLabel: 'Sub-step 1  ·  Identify the indeterminate form',
      promptTex: '',
      problemTex: '',
      choices: P.formChoices,
      onPick: (info) => {
        const c2 = mcqCard({
          stepLabel: 'Sub-step 2  ·  Apply L\'Hôpital — what does the new limit equal?',
          promptTex: '',
          problemTex: P.diffTex,
          choices: P.evalChoices,
          onPick: (info2) => {
            // Record each sub-step independently (form ID + evaluation = 2 grades).
            ctx.recordStep('q6', info.correct);
            const updated = ctx.recordStep('q6', info2.correct);
            ctx.score.correct = updated.correct; ctx.score.total = updated.totalSteps;
            ctx.refreshScore();
            perStep[stepIdx] = (info.correct && info2.correct) ? 'done' : 'wrong';
            c2.appendChild(finalBanner({ ansTex: P.answerTex }));
            const row = el('div', { class: 'row' });
            if (stepIdx + 1 < TOTAL) {
              row.appendChild(el('button', { class: 'btn', text: 'Next problem', onclick: () => { stepIdx += 1; render(); } }));
            } else {
              ctx.recordProblemDone('q6');
              row.appendChild(el('button', { class: 'btn', text: 'Round again', onclick: () => { stepIdx = 0; perStep = []; render(); } }));
              row.appendChild(el('button', { class: 'btn alt', text: 'Dashboard', onclick: () => window.location.reload() }));
            }
            c2.appendChild(row);
          },
        });
        view.appendChild(c2);
      },
    });
    view.appendChild(c1);
    setTimeout(() => texFill(view), 0);
  }
  render();
}
