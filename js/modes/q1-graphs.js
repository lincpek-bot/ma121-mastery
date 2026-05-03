// Q1 — Graph Reading. Hand-built graph specs with verified answer keys.
import { el, clear, dots, modeHead, mcqCard, finalBanner, nextRow } from '../ui.js';
import { mulberry32, shuffle } from '../rng.js';

// Each graph spec describes a piecewise function on x-range. We render to SVG
// and ask 4 questions per problem (mirrors exam Q1 format, 4 parts).
//
// segments: [{ from, to, fn, openLeft, openRight, valueAt: {x, y, closed} }]
// fn returns y for x in [from,to]. For VAs we add a 'va' entry.
// holes: [{x, y}]; jumps express by openLeft/Right + valueAt.
// asymptotes: { vas: [x...], ha: y? }
//
// Questions are drawn from a fixed list per spec — each verified.

const PROBLEMS = [
  {
    name: 'Hole + Jump + VA',
    xRange: [-4, 4], yRange: [-4, 5],
    segments: [
      { from: -4, to: -2, fn: x => 0.5*x + 1, openRight: true },           // ends at (-2, 0)  open
      { from: -2, to:  1, fn: x => -x + 1,    openLeft: false, openRight: false }, // (-2,3) closed to (1,0)
      // hole at x=1, y = 0; actual value at x=1 is 2 (defined)
      { from: 1,  to: 1.0001, fn: x => 2, point: true },                    // explicit dot at (1,2)
      { from: 1,  to: 3, fn: x => x - 1, openLeft: true },                  // open at (1,0)
    ],
    points: [
      { x: -2, y: 0, kind: 'open' },
      { x: -2, y: 3, kind: 'closed' },
      { x: 1,  y: 0, kind: 'open' },
      { x: 1,  y: 2, kind: 'closed' },
    ],
    vas: [3],                  // VA at x=3, function blows up
    extraSegments: [
      { from: 3.0001, to: 4, fn: x => 6/(x-3) - 0.5 },                       // right branch of VA
    ],
    answers: {
      limAtMinus2Left: 0,        // 0.5*(-2)+1 = 0
      limAtMinus2Right: 3,
      fAtMinus2: 3,              // closed dot
      limAt1Left: 0,
      limAt1Right: 0,            // x-1 at x=1+ = 0
      limAt1Exists: true,
      fAt1: 2,
      contAt1: false,
      contAtMinus2: false,       // jump
      vas: [3],
      holes: [{x: 1, y: 0}],
    },
    questions: [
      {
        prompt: '\\text{Find } \\lim_{x\\to -2^-} f(x).',
        choices: [
          { label: '0',  correct: true,  why: 'Left branch is 0.5x+1; at x=-2 that is 0.' },
          { label: '3',  why: 'That is the closed dot value f(-2), not the left limit.' },
          { label: '−1', why: 'Watch the slope: 0.5(-2)+1 = 0, not -1.' },
          { label: 'DNE',why: 'The left branch is continuous up to x=-2, so the left limit exists.' },
        ],
      },
      {
        prompt: '\\text{Find } \\lim_{x\\to -2^+} f(x).',
        choices: [
          { label: '0',  why: 'That is the left limit, not the right.' },
          { label: '3',  correct: true, why: 'Right branch -x+1 at x=-2 gives 3 (closed dot).' },
          { label: 'DNE',why: 'Right branch is continuous from -2 onward.' },
          { label: '−3', why: 'Sign error — -(-2)+1 = 3.' },
        ],
      },
      {
        prompt: '\\text{Is } f \\text{ continuous at } x=-2?',
        choices: [
          { label: 'Yes', why: 'Left limit (0) ≠ right limit (3) — jump discontinuity.' },
          { label: 'No — jump',  correct: true, why: 'Both one-sided limits exist but disagree (0 vs 3).' },
          { label: 'No — hole',  why: 'A hole means limit exists but f(a) differs. Here the limit itself does not exist.' },
          { label: 'No — VA',    why: 'No infinite behavior at x=-2.' },
        ],
      },
      {
        prompt: '\\text{Identify the type of discontinuity at } x=1.',
        choices: [
          { label: 'Removable (hole)', correct: true, why: 'Both one-sided limits equal 0, but f(1)=2, so the limit exists but ≠ f(1).' },
          { label: 'Jump', why: 'Left and right limits both equal 0 — they agree, so it is not a jump.' },
          { label: 'Vertical asymptote', why: 'No infinite behavior at x=1.' },
          { label: 'Continuous', why: 'f(1)=2 but the limit is 0, so it is not continuous.' },
        ],
      },
    ],
  },

  {
    name: 'VA + HA simple',
    xRange: [-5, 5], yRange: [-4, 4],
    // f(x) = 2/(x-2) + 1 → VA at x=2, HA at y=1
    segments: [
      { from: -5, to: 1.95, fn: x => 2/(x-2) + 1 },
      { from: 2.05, to: 5, fn: x => 2/(x-2) + 1 },
    ],
    points: [],
    vas: [2],
    has: 1,
    answers: { va: 2, ha: 1 },
    questions: [
      {
        prompt: '\\text{Identify the vertical asymptote.}',
        choices: [
          { label: 'x = 2', correct: true, why: 'Denominator x-2=0 at x=2 and the curve diverges to ±∞.' },
          { label: 'x = 1', why: 'No singular behavior at x=1.' },
          { label: 'x = 0', why: 'No singular behavior at x=0.' },
          { label: 'No VA', why: 'The graph clearly diverges as x→2.' },
        ],
      },
      {
        prompt: '\\text{Identify the horizontal asymptote.}',
        choices: [
          { label: 'y = 1', correct: true, why: 'As x→±∞ the 2/(x-2) term dies and f→1.' },
          { label: 'y = 0', why: 'There is a vertical shift of +1 — the HA is not zero.' },
          { label: 'y = 2', why: 'Confusing the numerator 2 with the HA.' },
          { label: 'No HA', why: 'Far left and right both flatten — there is an HA.' },
        ],
      },
      {
        prompt: '\\lim_{x\\to 2^-} f(x) = ?',
        choices: [
          { label: '−∞', correct: true, why: 'Just left of 2 the denominator is small negative, so 2/(neg) → −∞.' },
          { label: '+∞', why: 'That is the right-hand limit. From the left, denominator is negative.' },
          { label: '1',  why: 'That is the HA, not the limit at the VA.' },
          { label: '0',  why: '2 over a tiny number is huge in magnitude, not zero.' },
        ],
      },
      {
        prompt: '\\lim_{x\\to \\infty} f(x) = ?',
        choices: [
          { label: '1', correct: true, why: '2/(x-2) → 0, leaving the +1.' },
          { label: '0', why: 'You forgot the +1 shift.' },
          { label: '∞', why: 'The function levels off — no VA at infinity.' },
          { label: '2', why: 'The 2 in the numerator dies; only the +1 survives.' },
        ],
      },
    ],
  },

  {
    name: 'Removable hole only',
    xRange: [-3, 5], yRange: [-2, 6],
    // f(x) = (x^2 - 4)/(x-2) for x ≠ 2 = x+2; f(2)=5 (defined elsewhere → still removable)
    segments: [{ from: -3, to: 1.95, fn: x => x + 2 }, { from: 2.05, to: 5, fn: x => x + 2 }],
    points: [{ x: 2, y: 4, kind: 'open' }, { x: 2, y: 5, kind: 'closed' }],
    answers: { hole: { x: 2, y: 4 }, fAt2: 5 },
    questions: [
      {
        prompt: '\\lim_{x\\to 2} f(x) = ?',
        choices: [
          { label: '4', correct: true, why: 'Both sides approach the line y=x+2 at x=2 → 4. The defined value at x=2 does not change the limit.' },
          { label: '5', why: '5 is f(2), not the limit. The limit is what the curve heads to, not the dot.' },
          { label: 'DNE', why: 'Both sides agree on 4.' },
          { label: '2',  why: 'Don’t plug into x — plug into the simplified expression x+2.' },
        ],
      },
      {
        prompt: '\\text{What is } f(2)?',
        choices: [
          { label: '5', correct: true, why: 'The closed dot at (2,5) marks the actual function value.' },
          { label: '4', why: '(2,4) is the open hole — the limit, not f(2).' },
          { label: 'undefined', why: 'There is a closed dot at (2,5), so it is defined.' },
          { label: '0', why: 'No.' },
        ],
      },
      {
        prompt: '\\text{Is } f \\text{ continuous at } x=2?',
        choices: [
          { label: 'No — removable', correct: true, why: 'Limit exists (=4) but ≠ f(2)=5. Classic removable discontinuity.' },
          { label: 'Yes', why: 'Continuity needs lim = f(a). Here 4 ≠ 5.' },
          { label: 'No — jump', why: 'Both sides agree on 4 — not a jump.' },
          { label: 'No — VA', why: 'Function is finite there.' },
        ],
      },
      {
        prompt: '\\text{What kind of point is } (2,4)?',
        choices: [
          { label: 'A hole', correct: true, why: 'Open circle = the curve approaches it, but f is not equal to that value there.' },
          { label: 'f(2)', why: 'f(2) is the closed dot at (2,5).' },
          { label: 'A vertical asymptote', why: 'No infinite behavior.' },
          { label: 'An x-intercept', why: 'It is not on the x-axis.' },
        ],
      },
    ],
  },

  {
    name: 'Two VAs (rational with two zeros in denom)',
    xRange: [-5, 5], yRange: [-5, 5],
    // f(x) = 1/((x-1)(x+2))  + draw three branches
    segments: [
      { from: -5, to: -2.1, fn: x => 1/((x-1)*(x+2)) },
      { from: -1.9, to: 0.9, fn: x => 1/((x-1)*(x+2)) },
      { from: 1.1, to: 5, fn: x => 1/((x-1)*(x+2)) },
    ],
    vas: [-2, 1], has: 0,
    answers: { vas: [-2, 1], ha: 0 },
    questions: [
      {
        prompt: '\\text{How many vertical asymptotes does } f \\text{ have?}',
        choices: [
          { label: '2', correct: true, why: 'Denominator zeros at x=-2 and x=1; the curve diverges at each.' },
          { label: '1', why: 'Look again — there are two dashed vertical lines.' },
          { label: '0', why: 'The graph clearly blows up twice.' },
          { label: '3', why: 'Only two singularities are shown.' },
        ],
      },
      {
        prompt: '\\lim_{x\\to 1^+} f(x) = ?',
        choices: [
          { label: '+∞', correct: true, why: 'Just right of 1: (x-1) tiny positive, (x+2) ≈ 3 positive → +∞.' },
          { label: '−∞', why: 'Both factors are positive just right of 1 — sign is positive.' },
          { label: '0', why: '1/tiny is huge, not zero.' },
          { label: '1', why: 'No.' },
        ],
      },
      {
        prompt: '\\text{Identify the horizontal asymptote.}',
        choices: [
          { label: 'y = 0', correct: true, why: 'Degree of numerator (0) < degree of denominator (2), so HA is y=0.' },
          { label: 'y = 1', why: 'Coefficients do not match — degree comparison wins.' },
          { label: 'No HA', why: 'Numerator degree is smaller than denominator — HA exists.' },
          { label: 'y = -2', why: 'No.' },
        ],
      },
      {
        prompt: '\\text{At which x-values is } f \\text{ discontinuous?}',
        choices: [
          { label: 'x = -2 and x = 1', correct: true, why: 'Those are exactly the denominator zeros (VAs).' },
          { label: 'x = 0 only', why: 'f(0) is defined (=-1/2). No issue at 0.' },
          { label: 'x = 1 only', why: 'There are two VAs.' },
          { label: 'Nowhere',    why: 'The graph is broken at the two dashed lines.' },
        ],
      },
    ],
  },
];

export function mount(view, ctx) {
  let probIdx = 0;
  let stepIdx = 0;
  let perStep = []; // 'done' | 'wrong' for dot states
  const seed = (Date.now() & 0xffff);
  const order = shuffle(mulberry32(seed), PROBLEMS.map((_, i) => i));

  function render() {
    const p = PROBLEMS[order[probIdx % order.length]];
    clear(view);
    view.appendChild(modeHead({
      qLabel: 'Q1 · ★★★', title: 'Graph Reading',
      sub: 'Read limits, continuity, asymptotes, and holes directly from the graph.',
      score: { correct: ctx.score.correct, total: ctx.score.total },
    }));
    view.appendChild(dots(p.questions.length, stepIdx, perStep));
    const card = el('div', { class: 'card' });
    card.appendChild(el('div', { class: 'step-label', text: `Problem ${probIdx + 1} · Part ${stepIdx + 1} of ${p.questions.length}` }));
    card.appendChild(graphSvg(p));
    const q = p.questions[stepIdx];
    const sub = mcqCard({
      stepLabel: '',
      promptTex: q.prompt,
      choices: q.choices,
      onPick: (info) => {
        const updated = ctx.recordStep('q1', info.correct);
        ctx.score.correct = updated.correct; ctx.score.total = updated.totalSteps;
        ctx.refreshScore();
        perStep[stepIdx] = info.correct ? 'done' : 'wrong';
        const row = el('div', { class: 'row' });
        if (stepIdx + 1 < p.questions.length) {
          row.appendChild(el('button', { class: 'btn', text: 'Next part', onclick: () => { stepIdx += 1; render(); } }));
        } else {
          ctx.recordProblemDone('q1');
          row.appendChild(el('button', { class: 'btn', text: 'Next problem', onclick: () => { probIdx += 1; stepIdx = 0; perStep = []; render(); } }));
          row.appendChild(el('button', { class: 'btn alt', text: 'Back to dashboard', onclick: () => { window.location.reload(); } }));
        }
        sub.appendChild(row);
      },
    });
    // Strip the outer card class so we can wrap it ourselves
    sub.className = '';
    sub.style.padding = '0';
    card.appendChild(sub);
    view.appendChild(card);
  }

  render();
}

// SVG rendering. Maps mathematical (x,y) to pixel coordinates.
function graphSvg(p) {
  const W = 520, H = 320, pad = 28;
  const [xmin, xmax] = p.xRange, [ymin, ymax] = p.yRange;
  const sx = x => pad + (x - xmin) / (xmax - xmin) * (W - 2 * pad);
  const sy = y => H - pad - (y - ymin) / (ymax - ymin) * (H - 2 * pad);
  const yClamp = y => Math.max(ymin - 2, Math.min(ymax + 2, y));

  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'graph');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('width', W);
  svg.setAttribute('height', H);

  // gridlines
  for (let gx = Math.ceil(xmin); gx <= Math.floor(xmax); gx++) {
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('class', 'grid');
    line.setAttribute('x1', sx(gx)); line.setAttribute('x2', sx(gx));
    line.setAttribute('y1', sy(ymin)); line.setAttribute('y2', sy(ymax));
    svg.appendChild(line);
  }
  for (let gy = Math.ceil(ymin); gy <= Math.floor(ymax); gy++) {
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('class', 'grid');
    line.setAttribute('x1', sx(xmin)); line.setAttribute('x2', sx(xmax));
    line.setAttribute('y1', sy(gy));   line.setAttribute('y2', sy(gy));
    svg.appendChild(line);
  }

  // axes
  const ax = document.createElementNS(NS, 'line');
  ax.setAttribute('class', 'axis');
  ax.setAttribute('x1', sx(xmin)); ax.setAttribute('x2', sx(xmax));
  ax.setAttribute('y1', sy(0));    ax.setAttribute('y2', sy(0));
  svg.appendChild(ax);
  const ay = document.createElementNS(NS, 'line');
  ay.setAttribute('class', 'axis');
  ay.setAttribute('x1', sx(0)); ay.setAttribute('x2', sx(0));
  ay.setAttribute('y1', sy(ymin)); ay.setAttribute('y2', sy(ymax));
  svg.appendChild(ay);

  // ticks (integers)
  for (let gx = Math.ceil(xmin); gx <= Math.floor(xmax); gx++) {
    if (gx === 0) continue;
    const t = document.createElementNS(NS, 'line');
    t.setAttribute('class', 'tick');
    t.setAttribute('x1', sx(gx)); t.setAttribute('x2', sx(gx));
    t.setAttribute('y1', sy(0) - 3); t.setAttribute('y2', sy(0) + 3);
    svg.appendChild(t);
    const tl = document.createElementNS(NS, 'text');
    tl.setAttribute('class', 'ticklbl');
    tl.setAttribute('x', sx(gx)); tl.setAttribute('y', sy(0) + 13);
    tl.setAttribute('text-anchor', 'middle');
    tl.textContent = gx;
    svg.appendChild(tl);
  }
  for (let gy = Math.ceil(ymin); gy <= Math.floor(ymax); gy++) {
    if (gy === 0) continue;
    const tl = document.createElementNS(NS, 'text');
    tl.setAttribute('class', 'ticklbl');
    tl.setAttribute('x', sx(0) - 6); tl.setAttribute('y', sy(gy) + 3);
    tl.setAttribute('text-anchor', 'end');
    tl.textContent = gy;
    svg.appendChild(tl);
  }

  // VAs
  (p.vas || []).forEach(vx => {
    const v = document.createElementNS(NS, 'line');
    v.setAttribute('class', 'va');
    v.setAttribute('x1', sx(vx)); v.setAttribute('x2', sx(vx));
    v.setAttribute('y1', sy(ymin)); v.setAttribute('y2', sy(ymax));
    svg.appendChild(v);
  });
  // HA
  if (typeof p.has === 'number') {
    const h = document.createElementNS(NS, 'line');
    h.setAttribute('class', 'ha');
    h.setAttribute('x1', sx(xmin)); h.setAttribute('x2', sx(xmax));
    h.setAttribute('y1', sy(p.has)); h.setAttribute('y2', sy(p.has));
    svg.appendChild(h);
  }

  // segments: draw each as a polyline
  const allSegs = (p.segments || []).concat(p.extraSegments || []);
  allSegs.forEach(seg => {
    if (seg.point) {
      // a single closed dot — handled by points list normally; skip here
      return;
    }
    const N = 80;
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const x = seg.from + (i / N) * (seg.to - seg.from);
      const y = seg.fn(x);
      if (!isFinite(y)) continue;
      pts.push(`${sx(x)},${sy(yClamp(y))}`);
    }
    if (pts.length === 0) return;
    const poly = document.createElementNS(NS, 'polyline');
    poly.setAttribute('class', 'curve');
    poly.setAttribute('points', pts.join(' '));
    svg.appendChild(poly);

    // open/closed at endpoints when explicitly flagged
    if (seg.openLeft) {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('class', 'open');
      c.setAttribute('cx', sx(seg.from)); c.setAttribute('cy', sy(seg.fn(seg.from)));
      c.setAttribute('r', 4);
      svg.appendChild(c);
    }
    if (seg.openRight) {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('class', 'open');
      c.setAttribute('cx', sx(seg.to)); c.setAttribute('cy', sy(seg.fn(seg.to)));
      c.setAttribute('r', 4);
      svg.appendChild(c);
    }
  });

  // explicit points (closed/open dots)
  (p.points || []).forEach(pt => {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('class', pt.kind === 'closed' ? 'closed' : 'open');
    c.setAttribute('cx', sx(pt.x)); c.setAttribute('cy', sy(pt.y));
    c.setAttribute('r', 4.5);
    svg.appendChild(c);
  });

  const wrap = el('div', { class: 'graph-wrap' });
  wrap.appendChild(svg);
  return wrap;
}
