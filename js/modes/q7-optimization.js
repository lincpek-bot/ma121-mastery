// Q7 — Optimization word problems. Guided 4-step walk per problem.
import { el, clear, dots, modeHead, mcqCard, finalBanner, methodPanel } from '../ui.js';
import { METHODS } from '../methods.js';
import { texFill } from '../katex-helper.js';
import { mulberry32, shuffle } from '../rng.js';

const BANK = [
  {
    title: 'Fence against a wall',
    setup: 'You have 200 ft of fence to enclose a rectangular field along a straight river. The river-side needs no fence. Maximize area.',
    variables: 'Let x = side parallel to the river, y = each of the two perpendicular sides.',
    objective: {
      tex: 'A = x \\cdot y',
      choices: [
        { tex: 'A = xy',         correct: true,  why: 'Area of a rectangle.' },
        { tex: 'A = 2x + 2y',    correct: false, why: 'That is perimeter, not area.' },
        { tex: 'A = x + y',      correct: false, why: 'Linear, not area.' },
        { tex: 'A = x^{2}',      correct: false, why: 'A square would have only one variable, but the river side and perpendiculars differ.' },
      ],
    },
    constraint: {
      tex: 'x + 2y = 200',
      choices: [
        { tex: 'x + 2y = 200',   correct: true,  why: 'Only one parallel side and two perpendicular sides need fencing.' },
        { tex: '2x + 2y = 200',  correct: false, why: 'River side is free — only one x is fenced.' },
        { tex: 'x + y = 200',    correct: false, why: 'Two perpendicular sides means 2y, not y.' },
        { tex: 'xy = 200',       correct: false, why: 'That would make 200 the area, not the fence length.' },
      ],
    },
    eliminate: {
      tex: 'A(y) = (200 - 2y)\\cdot y = 200y - 2y^{2}',
      derivTex: "A'(y) = 200 - 4y",
      critTex: 'y = 50',
    },
    answer: {
      choices: [
        { tex: 'x = 100,\\ y = 50,\\ A = 5000\\,\\text{ft}^{2}', correct: true,  why: "A'(y)=200-4y=0 → y=50; x=200-2(50)=100; A=100·50=5000." },
        { tex: 'x = 50,\\ y = 100,\\ A = 5000\\,\\text{ft}^{2}',   correct: false, why: 'Swapped which side is the river side.' },
        { tex: 'x = 200,\\ y = 0,\\ A = 0',                         correct: false, why: 'Boundary — area is 0, not maximized.' },
        { tex: 'x = 66.7,\\ y = 66.7,\\ A = 4444',                  correct: false, why: 'That is the square solution — wrong constraint.' },
      ],
      ansTex: 'A_{\\max} = 5000\\,\\text{ft}^{2}\\ \\text{at }x=100,\\ y=50',
    },
  },
  {
    title: 'Open box from a square sheet',
    setup: 'Cut equal squares of side x from each corner of a 12 × 12 in sheet, then fold up the sides to make an open-top box. Maximize the volume.',
    variables: 'Let x = side length of the cut square. Then each base side is (12 - 2x), and height is x.',
    objective: {
      tex: 'V = x(12-2x)^{2}',
      choices: [
        { tex: 'V = x(12-2x)^{2}',     correct: true,  why: 'Base area (12-2x)^2 times height x.' },
        { tex: 'V = (12-2x)^{3}',      correct: false, why: 'Forgot the height factor x.' },
        { tex: 'V = 12 \\cdot x',       correct: false, why: 'Ignored the cut entirely.' },
        { tex: 'V = x^{2}(12-2x)',     correct: false, why: 'Mixed up which dimension is x.' },
      ],
    },
    constraint: {
      tex: '0 < x < 6',
      choices: [
        { tex: '0 < x < 6',  correct: true,  why: 'Need positive height and positive base side: 12-2x > 0 → x < 6.' },
        { tex: 'x \\ge 0',    correct: false, why: 'Need strict positivity AND x < 6.' },
        { tex: '0 < x < 12', correct: false, why: 'At x = 6 the base collapses; beyond it goes negative.' },
        { tex: 'x = 6',      correct: false, why: 'That gives volume 0.' },
      ],
    },
    eliminate: {
      tex: 'V(x) = x(12-2x)^{2}',
      derivTex: "V'(x) = (12-2x)^{2} + x\\cdot 2(12-2x)(-2) = (12-2x)\\big[(12-2x) - 4x\\big] = (12-2x)(12-6x)",
      critTex: 'x = 2 \\ \\text{(reject } x=6\\text{)}',
    },
    answer: {
      choices: [
        { tex: 'x = 2,\\ V = 128\\,\\text{in}^{3}',  correct: true,  why: 'V(2) = 2·8^2 = 2·64 = 128. Other root x=6 gives V=0.' },
        { tex: 'x = 6,\\ V = 0',                     correct: false, why: 'That minimizes (boundary), not maximizes.' },
        { tex: 'x = 3,\\ V = 108',                   correct: false, why: '3·6^2 = 108, but not the critical point.' },
        { tex: 'x = 4,\\ V = 64',                    correct: false, why: '4·4^2 = 64, not the max.' },
      ],
      ansTex: 'V_{\\max} = 128\\,\\text{in}^{3}\\ \\text{at }x=2',
    },
  },
  {
    title: 'Sum of two numbers, max product',
    setup: 'Two positive numbers add to 20. Maximize their product.',
    variables: 'Let the two numbers be x and y.',
    objective: {
      tex: 'P = xy',
      choices: [
        { tex: 'P = xy',          correct: true,  why: 'Product of the two numbers.' },
        { tex: 'P = x + y',       correct: false, why: 'That is the sum (the constraint).' },
        { tex: 'P = x^{2} + y^{2}', correct: false, why: 'Sum of squares is something else entirely.' },
        { tex: 'P = x/y',         correct: false, why: 'Quotient, not product.' },
      ],
    },
    constraint: {
      tex: 'x + y = 20',
      choices: [
        { tex: 'x + y = 20',   correct: true,  why: 'Stated in the problem.' },
        { tex: 'xy = 20',      correct: false, why: 'That swaps sum and product.' },
        { tex: 'x - y = 20',   correct: false, why: 'Difference, not sum.' },
        { tex: 'x = 20',       correct: false, why: 'Single value — ignores y.' },
      ],
    },
    eliminate: {
      tex: 'P(x) = x(20-x) = 20x - x^{2}',
      derivTex: "P'(x) = 20 - 2x",
      critTex: 'x = 10',
    },
    answer: {
      choices: [
        { tex: 'x = 10,\\ y = 10,\\ P = 100', correct: true,  why: "P'=20-2x=0 → x=10. P''=-2 < 0, max." },
        { tex: 'x = 5,\\ y = 15,\\ P = 75',   correct: false, why: 'Not the critical point.' },
        { tex: 'x = 1,\\ y = 19,\\ P = 19',   correct: false, why: 'Boundary-ish — far from the max.' },
        { tex: 'x = 20,\\ y = 0,\\ P = 0',    correct: false, why: 'That violates positivity / minimizes.' },
      ],
      ansTex: 'P_{\\max} = 100\\ \\text{at }x = y = 10',
    },
  },
  {
    title: 'Cylindrical can — minimum surface',
    setup: 'A closed cylindrical can must hold V = 16π in³. Minimize surface area S = 2πr² + 2πrh.',
    variables: 'Let r = radius, h = height.',
    objective: {
      tex: 'S = 2\\pi r^{2} + 2\\pi r h',
      choices: [
        { tex: 'S = 2\\pi r^{2} + 2\\pi r h',  correct: true,  why: 'Two circular ends plus side wall.' },
        { tex: 'S = \\pi r^{2} h',              correct: false, why: 'That is the volume, not surface area.' },
        { tex: 'S = 2\\pi r h',                  correct: false, why: 'Forgot the two circular ends (closed can).' },
        { tex: 'S = 4\\pi r^{2}',                correct: false, why: 'That is a sphere\'s surface.' },
      ],
    },
    constraint: {
      tex: '\\pi r^{2} h = 16\\pi \\ \\Rightarrow\\ h = \\dfrac{16}{r^{2}}',
      choices: [
        { tex: 'h = \\dfrac{16}{r^{2}}', correct: true,  why: 'From V = πr²h = 16π.' },
        { tex: 'h = \\dfrac{16}{r}',     correct: false, why: 'Dropped one r.' },
        { tex: 'h = 16 r^{2}',           correct: false, why: 'Inverted.' },
        { tex: 'h = 16 - r^{2}',         correct: false, why: 'Wrong algebra entirely.' },
      ],
    },
    eliminate: {
      tex: 'S(r) = 2\\pi r^{2} + 2\\pi r \\cdot \\dfrac{16}{r^{2}} = 2\\pi r^{2} + \\dfrac{32\\pi}{r}',
      derivTex: "S'(r) = 4\\pi r - \\dfrac{32\\pi}{r^{2}}",
      critTex: '4\\pi r = \\dfrac{32\\pi}{r^{2}} \\ \\Rightarrow\\ r^{3} = 8 \\ \\Rightarrow\\ r = 2',
    },
    answer: {
      choices: [
        { tex: 'r = 2,\\ h = 4,\\ S = 24\\pi', correct: true,  why: 'r=2 → h=16/4=4 → S = 2π(4)+2π(2)(4) = 8π+16π = 24π.' },
        { tex: 'r = 4,\\ h = 1,\\ S = 40\\pi',  correct: false, why: 'Not the critical point.' },
        { tex: 'r = 1,\\ h = 16,\\ S = 34\\pi', correct: false, why: 'Tall and skinny — surface area larger.' },
        { tex: 'r = 8,\\ h = 0.25,\\ S \\approx 132\\pi', correct: false, why: 'Way past the minimum.' },
      ],
      ansTex: 'S_{\\min} = 24\\pi\\,\\text{in}^{2}\\ \\text{at }r=2,\\ h=4',
    },
  },
];

export function mount(view, ctx) {
  const TOTAL = 3;
  let stepIdx = 0;
  let perStep = [];
  const seed = (Date.now() & 0xffff);
  const order = shuffle(mulberry32(seed), BANK.map((_, i) => i));

  function head() {
    return modeHead({
      qLabel: 'Q7 · ★★★', title: 'Optimization',
      sub: 'Variables → objective → constraint → eliminate → derivative → verify.',
      score: { correct: ctx.score.correct, total: ctx.score.total },
    });
  }
  function record(correct) {
    const updated = ctx.recordStep('q7', correct);
    ctx.score.correct = updated.correct; ctx.score.total = updated.totalSteps;
    ctx.refreshScore();
    perStep[stepIdx] = correct ? 'done' : 'wrong';
  }

  function render() {
    clear(view);
    view.appendChild(head());
    view.appendChild(methodPanel('q7', METHODS.q7));
    view.appendChild(dots(TOTAL, stepIdx, perStep));

    const probIdx = order[stepIdx % order.length];
    const P = BANK[probIdx];

    view.appendChild(el('div', { class: 'card' }, [
      el('div', { class: 'step-label', text: `Problem ${stepIdx + 1} of ${TOTAL}  ·  ${P.title}` }),
      el('p', { class: 'sub', text: P.setup }),
      el('p', { class: 'sub', text: P.variables }),
    ]));

    let ok1 = false, ok2 = false, ok3 = false;

    const c1 = mcqCard({
      stepLabel: 'Sub-step 1  ·  Objective function',
      promptTex: '\\text{What are you maximizing or minimizing?}',
      problemTex: '',
      choices: P.objective.choices,
      onPick: (info) => {
        ok1 = info.correct;
        const c2 = mcqCard({
          stepLabel: 'Sub-step 2  ·  Constraint equation',
          promptTex: '\\text{What relation links the variables?}',
          problemTex: '',
          choices: P.constraint.choices,
          onPick: (info2) => {
            ok2 = info2.correct;
            view.appendChild(el('div', { class: 'card' }, [
              el('div', { class: 'step-label', text: 'Sub-step 3  ·  Eliminate, then differentiate' }),
              el('div', { class: 'expr-box', data: { tex: P.eliminate.tex, display: '1' } }),
              el('div', { class: 'expr-box', data: { tex: P.eliminate.derivTex, display: '1' } }),
              el('div', { class: 'expr-box', data: { tex: P.eliminate.critTex, display: '1' } }),
            ]));
            const c3 = mcqCard({
              stepLabel: 'Sub-step 4  ·  Final answer',
              promptTex: '\\text{Plug back in. What is the optimum?}',
              problemTex: '',
              choices: P.answer.choices,
              onPick: (info3) => {
                ok3 = info3.correct;
                ctx.recordStep('q7', ok1);
                ctx.recordStep('q7', ok2);
                const updated = ctx.recordStep('q7', ok3);
                ctx.score.correct = updated.correct; ctx.score.total = updated.totalSteps;
                ctx.refreshScore();
                perStep[stepIdx] = (ok1 && ok2 && ok3) ? 'done' : 'wrong';
                c3.appendChild(finalBanner({ ansTex: P.answer.ansTex }));
                const row = el('div', { class: 'row' });
                if (stepIdx + 1 < TOTAL) {
                  row.appendChild(el('button', { class: 'btn', text: 'Next problem', onclick: () => { stepIdx += 1; render(); } }));
                } else {
                  ctx.recordProblemDone('q7');
                  row.appendChild(el('button', { class: 'btn', text: 'Round again', onclick: () => { stepIdx = 0; perStep = []; render(); } }));
                  row.appendChild(el('button', { class: 'btn alt', text: 'Dashboard', onclick: () => window.location.reload() }));
                }
                c3.appendChild(row);
              },
            });
            view.appendChild(c3);
            setTimeout(() => texFill(view), 0);
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
