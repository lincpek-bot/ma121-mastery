// Q3 — Indefinite integrals + u-sub trainer.
// Two flavors: direct antiderivative MCQ, and a guided u-sub walkthrough.
import { el, clear, dots, modeHead, mcqCard, finalBanner, methodPanel } from '../ui.js';
import { METHODS } from '../methods.js';
import { mulberry32, shuffle } from '../rng.js';

// Direct antiderivative MCQs (single step).
const DIRECT = [
  { f: '\\int x^{4}\\,dx', a: '\\dfrac{x^{5}}{5} + C',
    choices: ['\\dfrac{x^{5}}{5} + C', '\\dfrac{x^{4}}{4} + C', '4x^{3} + C', 'x^{5} + C'], correctIdx: 0,
    explain: ['Correct — power rule, raise exponent then divide.','You divided by the original exponent, not the new one.','That is the derivative, not the antiderivative.','Forgot to divide by 5.'] },
  { f: '\\int \\dfrac{1}{x}\\,dx', a: '\\ln|x| + C',
    choices: ['\\ln|x| + C', '\\ln(x) + C', '-\\dfrac{1}{x^{2}} + C', '\\dfrac{1}{x^{2}} + C'], correctIdx: 0,
    explain: ['Correct — note absolute value.','Missing absolute value — required for the general antiderivative of 1/x.','That’s the derivative direction.','Wrong direction.'] },
  { f: '\\int e^{x}\\,dx', a: 'e^{x} + C',
    choices: ['e^{x} + C', 'xe^{x} + C', '\\dfrac{e^{x+1}}{x+1} + C', 'e^{x-1} + C'], correctIdx: 0,
    explain: ['Correct — e^x is its own antiderivative.','Looks like product rule for derivatives — wrong.','Power-rule’d on an exponential.','No.'] },
  { f: '\\int e^{5x}\\,dx', a: '\\dfrac{1}{5}e^{5x} + C',
    choices: ['\\dfrac{1}{5}e^{5x} + C', '5e^{5x} + C', 'e^{5x} + C', '\\dfrac{e^{5x}}{x} + C'], correctIdx: 0,
    explain: ['Correct — divide by the inner constant 5.','That is the derivative form.','Forgot the 1/5 factor.','No.'] },
  { f: '\\int 3^{x}\\,dx', a: '\\dfrac{3^{x}}{\\ln 3} + C',
    choices: ['\\dfrac{3^{x}}{\\ln 3} + C', '3^{x}\\ln 3 + C', 'x\\cdot 3^{x-1} + C', '\\dfrac{3^{x+1}}{x+1} + C'], correctIdx: 0,
    explain: ['Correct — antiderivative of b^x is b^x / ln b.','That is the derivative.','Power rule misapplied.','Power rule misapplied.'] },
  { f: '\\int (2x^{3} - 5x + 1)\\,dx', a: '\\dfrac{x^{4}}{2} - \\dfrac{5x^{2}}{2} + x + C',
    choices: ['\\dfrac{x^{4}}{2} - \\dfrac{5x^{2}}{2} + x + C', '\\dfrac{2x^{4}}{4} - 5x + 1 + C', '6x^{2} - 5 + C', '\\dfrac{x^{4}}{2} - \\dfrac{5x^{2}}{2} + C'], correctIdx: 0,
    explain: ['Correct — power rule on each term.','You forgot to integrate the linear and constant terms.','Those are derivatives.','Forgot the antiderivative of the constant 1.'] },
  { f: '\\int \\sqrt{x}\\,dx', a: '\\dfrac{2}{3}x^{3/2} + C',
    choices: ['\\dfrac{2}{3}x^{3/2} + C', '\\dfrac{1}{2\\sqrt{x}} + C', '\\dfrac{2}{3}\\sqrt{x} + C', '\\sqrt{x} + C'], correctIdx: 0,
    explain: ['Correct — x^{1/2} → x^{3/2}/(3/2) = (2/3)x^{3/2}.','That is the derivative of sqrt(x).','Lost the exponent — should be x^{3/2}, not x^{1/2}.','Forgot to integrate at all.'] },
  { f: '\\int e^{-x}\\,dx', a: '-e^{-x} + C',
    choices: ['-e^{-x} + C', 'e^{-x} + C', '-xe^{-x} + C', '\\dfrac{e^{-x}}{-x} + C'], correctIdx: 0,
    explain: ['Correct — divide by inner constant -1.','Forgot the sign flip from the inner -1.','Confused with derivative shortcuts.','No.'] },
];

// U-sub guided problems — five steps each. Mirrors the existing trainer pattern.
const USUB = [
  {
    f: '\\int 2x \\cdot e^{x^{2}}\\,dx',
    u: 'u = x^{2}', du: 'du = 2x\\,dx',
    after: '\\int e^{u}\\,du', // exact form after substitution
    final: 'e^{x^{2}} + C',
    pickU: [
      { tex: 'u = x^{2}', correct: true,  why: 'Choosing u so that du captures the 2x factor.' },
      { tex: 'u = 2x',    why: 'Then du = 2 dx, but you would still have x and e^{x^2} unaccounted for.' },
      { tex: 'u = e^{x^{2}}', why: 'You can, but du involves e^{x^2}·2x — circular.' },
      { tex: 'u = x',     why: 'No simplification of the exponent.' },
    ],
    findDu: [
      { tex: 'du = 2x\\,dx', correct: true, why: 'd/dx[x^2] = 2x.' },
      { tex: 'du = x^{2}\\,dx', why: 'You wrote u, not du.' },
      { tex: 'du = 2\\,dx', why: 'Missing the x.' },
      { tex: 'du = x\\,dx', why: 'Off by a factor of 2.' },
    ],
    fixConst: [
      { tex: 'no fix needed',     correct: true, why: 'The 2x in the integrand exactly matches du.' },
      { tex: 'multiply by 1/2',   why: 'Only needed if you had extra constants — here it lines up.' },
      { tex: 'multiply by 2',     why: 'No extra factor of 2 to absorb.' },
      { tex: 'add a constant',    why: 'Constants are absorbed into +C, not added inline.' },
    ],
    integrateU: [
      { tex: 'e^{u} + C', correct: true, why: 'Antiderivative of e^u.' },
      { tex: 'u\\,e^{u} + C', why: 'That is product-rule territory.' },
      { tex: '\\dfrac{e^{u+1}}{u+1} + C', why: 'Power rule misapplied.' },
      { tex: 'e^{u-1} + C', why: 'No.' },
    ],
    substBack: [
      { tex: 'e^{x^{2}} + C', correct: true, why: 'Replace u with x^2.' },
      { tex: 'e^{u} + C', why: 'Substitute u back to x.' },
      { tex: 'e^{2x} + C', why: 'You used the inner derivative as the exponent.' },
      { tex: 'e^{x} + C', why: 'Lost the squared.' },
    ],
    verify: 'd/dx[e^{x^2}] = e^{x^2} · 2x — matches the integrand.',
  },
  {
    f: '\\int 3x^{2}(x^{3}+1)^{4}\\,dx',
    u: 'u = x^{3}+1', du: 'du = 3x^{2}\\,dx', after: '\\int u^{4}\\,du', final: '\\dfrac{(x^{3}+1)^{5}}{5} + C',
    pickU: [
      { tex: 'u = x^{3}+1', correct: true, why: 'Then du = 3x^2 dx — exact match for the front factor.' },
      { tex: 'u = x^{3}',   why: 'Then (u+1)^4 still has the +1; messier.' },
      { tex: 'u = (x^{3}+1)^{4}', why: 'du then has powers of (x^3+1) — circular.' },
      { tex: 'u = 3x^{2}',  why: 'Then du = 6x dx; doesn’t simplify the inside.' },
    ],
    findDu: [
      { tex: 'du = 3x^{2}\\,dx', correct: true, why: 'Power rule.' },
      { tex: 'du = x^{2}\\,dx', why: 'Forgot the constant 3.' },
      { tex: 'du = 3x\\,dx', why: 'Wrong power.' },
      { tex: 'du = 3\\,dx', why: 'No.' },
    ],
    fixConst: [
      { tex: 'no fix needed', correct: true, why: 'The 3x^2 in the integrand matches du exactly.' },
      { tex: 'multiply by 1/3', why: 'No extra 3 to remove.' },
      { tex: 'multiply by 3', why: 'No.' },
      { tex: 'multiply by 1/3x^{2}', why: 'Constants only — no x in the fixup.' },
    ],
    integrateU: [
      { tex: '\\dfrac{u^{5}}{5} + C', correct: true, why: 'Power rule on u^4.' },
      { tex: 'u^{5} + C', why: 'Forgot to divide by 5.' },
      { tex: '4u^{3} + C', why: 'That is the derivative of u^4.' },
      { tex: '\\dfrac{u^{4}}{4} + C', why: 'Wrong divisor and exponent.' },
    ],
    substBack: [
      { tex: '\\dfrac{(x^{3}+1)^{5}}{5} + C', correct: true, why: 'Replace u back.' },
      { tex: '\\dfrac{u^{5}}{5} + C', why: 'Need to back-substitute.' },
      { tex: '\\dfrac{(x^{3})^{5}}{5} + C', why: 'Lost the +1 inside.' },
      { tex: '(x^{3}+1)^{5} + C', why: 'Forgot to divide by 5.' },
    ],
    verify: 'd/dx[(x^3+1)^5/5] = (x^3+1)^4 · 3x^2 — matches.',
  },
  {
    f: '\\int \\dfrac{2x}{x^{2}+1}\\,dx',
    u: 'u = x^{2}+1', du: 'du = 2x\\,dx', after: '\\int \\dfrac{1}{u}\\,du', final: '\\ln(x^{2}+1) + C',
    pickU: [
      { tex: 'u = x^{2}+1', correct: true, why: 'du = 2x dx matches the numerator.' },
      { tex: 'u = 2x', why: 'Then du = 2 dx, doesn’t reduce the denominator.' },
      { tex: 'u = x^{2}', why: 'Leaves a +1 in the denominator.' },
      { tex: 'u = \\ln(x^{2}+1)', why: 'Circular — du involves the answer.' },
    ],
    findDu: [
      { tex: 'du = 2x\\,dx', correct: true, why: 'Power rule on x^2 plus constant.' },
      { tex: 'du = x\\,dx', why: 'Forgot the factor 2.' },
      { tex: 'du = (x^{2}+1)\\,dx', why: 'You wrote u not du.' },
      { tex: 'du = 2\\,dx', why: 'Lost the x.' },
    ],
    fixConst: [
      { tex: 'no fix needed', correct: true, why: 'The 2x on top exactly matches du.' },
      { tex: 'multiply by 1/2', why: 'No extra 2 to absorb.' },
      { tex: 'multiply by 2', why: 'No.' },
      { tex: 'multiply by x', why: 'Constants only.' },
    ],
    integrateU: [
      { tex: '\\ln|u| + C', correct: true, why: '∫ 1/u du = ln|u| + C.' },
      { tex: '\\dfrac{1}{u^{2}} + C', why: 'That’s the derivative direction.' },
      { tex: '-\\dfrac{1}{u} + C', why: 'No.' },
      { tex: 'u^{-1} + C', why: 'You forgot to integrate.' },
    ],
    substBack: [
      { tex: '\\ln(x^{2}+1) + C', correct: true, why: 'x^2+1 > 0, so |·| can be dropped.' },
      { tex: '\\ln|u| + C', why: 'Need to back-substitute u.' },
      { tex: '\\ln(2x) + C', why: 'You substituted the wrong thing.' },
      { tex: '\\dfrac{1}{x^{2}+1} + C', why: 'That’s the integrand, not the antiderivative.' },
    ],
    verify: 'd/dx[ln(x^2+1)] = (2x)/(x^2+1) — matches.',
  },
  {
    f: '\\int x \\cdot \\sqrt{x^{2}+9}\\,dx',
    u: 'u = x^{2}+9', du: 'du = 2x\\,dx', after: '\\dfrac{1}{2}\\int u^{1/2}\\,du', final: '\\dfrac{1}{3}(x^{2}+9)^{3/2} + C',
    pickU: [
      { tex: 'u = x^{2}+9', correct: true, why: 'du = 2x dx; x dx = du/2.' },
      { tex: 'u = \\sqrt{x^{2}+9}', why: 'Then du is messy with a square root.' },
      { tex: 'u = x^{2}', why: 'Leaves +9 inside the sqrt.' },
      { tex: 'u = x', why: 'Doesn’t simplify anything.' },
    ],
    findDu: [
      { tex: 'du = 2x\\,dx', correct: true, why: 'Power rule.' },
      { tex: 'du = x\\,dx', why: 'Off by 2.' },
      { tex: 'du = (x^{2}+9)\\,dx', why: 'You wrote u.' },
      { tex: 'du = 2\\,dx', why: 'Lost the x.' },
    ],
    fixConst: [
      { tex: 'multiply by 1/2', correct: true, why: 'Have x dx, need (1/2) du.' },
      { tex: 'no fix needed', why: 'You only have x dx — that is half of du.' },
      { tex: 'multiply by 2', why: 'Wrong direction.' },
      { tex: 'multiply by 1/2x', why: 'Constants only.' },
    ],
    integrateU: [
      { tex: '\\dfrac{1}{2}\\cdot\\dfrac{u^{3/2}}{3/2} + C', correct: true, why: '(1/2)·(2/3) u^{3/2} = (1/3) u^{3/2}.' },
      { tex: 'u^{3/2} + C', why: 'Forgot the 1/2 and the 2/3.' },
      { tex: '\\dfrac{1}{2}\\sqrt{u} + C', why: 'That’s the derivative direction.' },
      { tex: '\\dfrac{u^{1/2}}{1/2} + C', why: 'Wrong exponent rule.' },
    ],
    substBack: [
      { tex: '\\dfrac{1}{3}(x^{2}+9)^{3/2} + C', correct: true, why: 'Substitute u back.' },
      { tex: '\\dfrac{1}{3}u^{3/2} + C', why: 'Substitute u back to x.' },
      { tex: '\\dfrac{1}{3}\\sqrt{x^{2}+9} + C', why: 'Wrong exponent — should be 3/2.' },
      { tex: '\\dfrac{2}{3}(x^{2}+9)^{3/2} + C', why: 'You forgot the 1/2 fix-up factor.' },
    ],
    verify: 'd/dx[(1/3)(x^2+9)^{3/2}] = (1/3)·(3/2)·(x^2+9)^{1/2}·2x = x·sqrt(x^2+9) ✓',
  },
];

const MODES_LIST = ['direct', 'usub'];

export function mount(view, ctx) {
  let mode = 'menu';
  function menu() {
    clear(view);
    view.appendChild(modeHead({
      qLabel: 'Q3 · ★★', title: 'Indefinite Integrals',
      sub: 'Pick a drill: quick antiderivative MCQs, or a guided u-substitution walk.',
      score: { correct: ctx.score.correct, total: ctx.score.total },
    }));
    view.appendChild(methodPanel('q3', METHODS.q3.title, METHODS.q3.body));
    const grid = el('div', { class: 'mode-grid' });
    grid.appendChild(modeBtn('Direct antiderivatives', '8-card MCQ session', () => { mode = 'direct'; runDirect(); }));
    grid.appendChild(modeBtn('U-substitution walk',    '5-step guided trainer', () => { mode = 'usub'; runUsub(); }));
    view.appendChild(grid);
  }
  function modeBtn(title, sub, on) {
    const b = el('button', { class: 'mode-card', type: 'button' });
    b.appendChild(el('h3', { text: title }));
    b.appendChild(el('p', { text: sub }));
    b.addEventListener('click', on);
    return b;
  }

  function runDirect() {
    const TOTAL = 5;
    let i = 0; let perStep = [];
    const order = shuffle(mulberry32(Date.now() & 0xffff), DIRECT.map((_, k) => k));
    function go() {
      clear(view);
      view.appendChild(modeHead({ qLabel: 'Q3 · Direct antiderivatives', title: 'Indefinite Integrals',
        sub: 'Pick the antiderivative.', score: { correct: ctx.score.correct, total: ctx.score.total } }));
      view.appendChild(dots(TOTAL, i, perStep));
      const p = DIRECT[order[i % order.length]];
      const card = mcqCard({
        stepLabel: `Step ${i + 1} of ${TOTAL}`, problemTex: p.f,
        choices: p.choices.map((c, k) => ({ tex: c, correct: k === p.correctIdx, why: p.explain[k] })),
        onPick: (info) => {
          const updated = ctx.recordStep('q3', info.correct);
          ctx.score.correct = updated.correct; ctx.score.total = updated.totalSteps;
          ctx.refreshScore();
          perStep[i] = info.correct ? 'done' : 'wrong';
          const row = el('div', { class: 'row' });
          if (i + 1 < TOTAL) row.appendChild(el('button', { class: 'btn', text: 'Next', onclick: () => { i += 1; go(); } }));
          else {
            ctx.recordProblemDone('q3');
            row.appendChild(el('button', { class: 'btn', text: 'Round again', onclick: () => { i = 0; perStep = []; go(); } }));
            row.appendChild(el('button', { class: 'btn alt', text: 'Switch drill', onclick: menu }));
          }
          card.appendChild(row);
        },
      });
      view.appendChild(card);
    }
    go();
  }

  function runUsub() {
    let probIdx = 0; let stepIdx = 0; let perStep = [];
    const STEPS = ['pickU', 'findDu', 'fixConst', 'integrateU', 'substBack'];
    const STEP_PROMPTS = [
      'Choose u',
      'Find du',
      'Fix the constant',
      'Integrate in terms of u',
      'Substitute back',
    ];
    const order = shuffle(mulberry32(Date.now() & 0xffff), USUB.map((_, k) => k));

    function go() {
      const p = USUB[order[probIdx % order.length]];
      clear(view);
      view.appendChild(modeHead({ qLabel: 'Q3 · U-substitution', title: 'Indefinite Integrals',
        sub: 'Five steps per problem.', score: { correct: ctx.score.correct, total: ctx.score.total } }));
      view.appendChild(dots(STEPS.length, stepIdx, perStep));

      const wrapCard = el('div', { class: 'card' });
      wrapCard.appendChild(el('div', { class: 'step-label', text: `Problem ${probIdx + 1} · Step ${stepIdx + 1} of 5` }));
      wrapCard.appendChild(el('div', { class: 'expr-box', data: { tex: p.f, display: '1' } }));

      const choiceCard = mcqCard({
        stepLabel: STEP_PROMPTS[stepIdx], promptTex: '', choices: p[STEPS[stepIdx]],
        onPick: (info) => {
          const updated = ctx.recordStep('q3', info.correct);
          ctx.score.correct = updated.correct; ctx.score.total = updated.totalSteps;
          ctx.refreshScore();
          perStep[stepIdx] = info.correct ? 'done' : 'wrong';
          const row = el('div', { class: 'row' });
          if (stepIdx + 1 < STEPS.length) {
            row.appendChild(el('button', { class: 'btn', text: 'Next step', onclick: () => { stepIdx += 1; go(); } }));
          } else {
            ctx.recordProblemDone('q3');
            wrapCard.appendChild(finalBanner({ ansTex: p.final, verifyText: `Verify by differentiating: ${p.verify}` }));
            row.appendChild(el('button', { class: 'btn', text: 'Next problem', onclick: () => { probIdx += 1; stepIdx = 0; perStep = []; go(); } }));
            row.appendChild(el('button', { class: 'btn alt', text: 'Switch drill', onclick: menu }));
          }
          choiceCard.appendChild(row);
        },
      });
      // strip choiceCard wrapping classes
      choiceCard.className = ''; choiceCard.style.padding = '0';
      wrapCard.appendChild(choiceCard);
      view.appendChild(wrapCard);
    }
    go();
  }

  menu();
}
