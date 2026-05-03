// Q4 — Riemann sums + FTC.
// Canvas with rectangles, slider for n, left/right toggle, FTC verify.
import { el, clear, dots, modeHead, mcqCard, finalBanner, methodPanel } from '../ui.js';
import { METHODS } from '../methods.js';
import { mulberry32, shuffle } from '../rng.js';
import { round } from '../math/format.js';

const PROBLEMS = [
  // Each: f(x) callable, FTC antiderivative F(x) callable, interval [a,b],
  // pretty-print TeX strings, monotonicity ('inc' | 'dec' | 'mixed').
  { fLabel: 'f(x) = x^{2}+1', f: x => x*x+1, F: x => x*x*x/3 + x, a: 0, b: 4,
    Ftex: '\\dfrac{x^{3}}{3} + x', exactTex: '\\dfrac{76}{3}', exact: 76/3, mono: 'inc' },
  { fLabel: 'f(x) = 2x', f: x => 2*x, F: x => x*x, a: 1, b: 5,
    Ftex: 'x^{2}', exactTex: '24', exact: 24, mono: 'inc' },
  { fLabel: 'f(x) = 4-x', f: x => 4 - x, F: x => 4*x - x*x/2, a: 0, b: 3,
    Ftex: '4x - \\dfrac{x^{2}}{2}', exactTex: '\\dfrac{15}{2}', exact: 15/2, mono: 'dec' },
  { fLabel: 'f(x) = x^{3}', f: x => x*x*x, F: x => x*x*x*x/4, a: 0, b: 2,
    Ftex: '\\dfrac{x^{4}}{4}', exactTex: '4', exact: 4, mono: 'inc' },
];

export function mount(view, ctx) {
  const order = shuffle(mulberry32(Date.now() & 0xffff), PROBLEMS.map((_, i) => i));
  let probIdx = 0;
  let stepIdx = 0;     // 0: choose left/right, 1: predict over/under, 2: FTC value
  let perStep = [];
  let chosenSide = 'right';
  let n = 4;

  function render() {
    const p = PROBLEMS[order[probIdx % order.length]];
    clear(view);
    view.appendChild(modeHead({ qLabel: 'Q4 · ★★★', title: 'Riemann Sums + FTC',
      sub: 'Drag the slider for n, pick left or right, then verify with the FTC.',
      score: { correct: ctx.score.correct, total: ctx.score.total } }));
    view.appendChild(methodPanel('q4', METHODS.q4.title, METHODS.q4.body));
    view.appendChild(dots(3, stepIdx, perStep));

    const card = el('div', { class: 'card' });
    card.appendChild(el('div', { class: 'step-label',
      text: `Problem ${probIdx + 1} · ${p.fLabel.replace(/\\\\/g, '\\').replace(/\^\{(\d)\}/g, '^$1')} on [${p.a}, ${p.b}]` }));
    card.appendChild(el('div', { class: 'expr-box', data: { tex: `\\int_{${p.a}}^{${p.b}} ${p.fLabel.replace('f(x) = ', '')}\\,dx`, display: '1' } }));

    // canvas + slider
    const canvasWrap = el('div', { class: 'riemann-wrap' });
    const canvas = document.createElement('canvas');
    canvas.className = 'riemann';
    canvas.width = 480; canvas.height = 280;
    canvasWrap.appendChild(canvas);
    card.appendChild(canvasWrap);

    const sumDisp = el('div', { class: 'feedback hint' });
    const slider = el('input', { type: 'range', min: 1, max: 30, value: n });
    slider.addEventListener('input', () => { n = +slider.value; redraw(); });
    const sideRow = el('div', { class: 'row' });
    const leftBtn = el('button', { class: 'btn alt', text: 'Left sum', onclick: () => { chosenSide = 'left'; redraw(); leftBtn.classList.remove('alt'); rightBtn.classList.add('alt'); } });
    const rightBtn = el('button', { class: 'btn',  text: 'Right sum', onclick: () => { chosenSide = 'right'; redraw(); rightBtn.classList.remove('alt'); leftBtn.classList.add('alt'); } });
    sideRow.appendChild(leftBtn); sideRow.appendChild(rightBtn);
    card.appendChild(sideRow);
    card.appendChild(el('div', { class: 'slider-row' }, [el('span', { text: 'n =' }), slider, el('span', { text: '', id: 'nlbl' })]));
    card.appendChild(sumDisp);

    function redraw() {
      drawRiemann(canvas, p, n, chosenSide);
      const dx = (p.b - p.a) / n;
      let sum = 0;
      for (let i = 0; i < n; i++) {
        const xk = chosenSide === 'left' ? p.a + i * dx : p.a + (i + 1) * dx;
        sum += p.f(xk);
      }
      sum *= dx;
      const sign = sum > p.exact + 1e-9 ? 'over' : sum < p.exact - 1e-9 ? 'under' : 'exact';
      sumDisp.innerHTML = `${chosenSide === 'left' ? 'L' : 'R'}<sub>${n}</sub> ≈ <b>${round(sum, 4)}</b> &nbsp;·&nbsp; exact = <b>${round(p.exact, 4)}</b> &nbsp;·&nbsp; ${sign === 'exact' ? 'matches' : sign + 'estimate'}`;
      const lbl = card.querySelector('#nlbl');
      if (lbl) lbl.textContent = String(n);
    }
    redraw();

    // The interactive question depends on stepIdx
    let stepNode;
    if (stepIdx === 0) {
      stepNode = mcqCard({
        stepLabel: 'Step 1 — predict the sign', promptTex: `\\text{With the function above on [${p.a},${p.b}], the right Riemann sum will:}`,
        choices: [
          { label: 'Overestimate', correct: p.mono === 'inc', why: p.mono === 'inc' ? 'Yes — increasing function, right endpoints sit above the curve.' : 'For decreasing functions, right endpoints sit below the curve.' },
          { label: 'Underestimate', correct: p.mono === 'dec', why: p.mono === 'dec' ? 'Yes — decreasing, right endpoints below the curve.' : 'For increasing functions, right endpoints sit above the curve.' },
          { label: 'Match exactly', why: 'Riemann sums only match exactly for very special cases (and as n→∞).' },
          { label: 'It depends on n', why: 'For monotonic f, the side of the estimate is determined by direction, not n.' },
        ],
        onPick: handlePick(0),
      });
    } else if (stepIdx === 1) {
      // Compute exact L_n / R_n at current n=4 for a tractable arithmetic check
      const dx = (p.b - p.a) / 4;
      let r = 0; for (let i = 0; i < 4; i++) r += p.f(p.a + (i + 1) * dx);
      r *= dx;
      const correctVal = round(r, 4);
      const wrong1 = round(r - dx * (p.f(p.b) - p.f(p.a)), 4); // left sum value
      const wrong2 = round(r + dx, 4);
      const wrong3 = round(p.exact, 4);
      stepNode = mcqCard({
        stepLabel: 'Step 2 — compute R₄', promptTex: `\\text{With } n=4, \\Delta x = ${round((p.b-p.a)/4,3)}. \\text{ Right sum } R_4 = ?`,
        choices: shuffle(mulberry32(probIdx * 7 + 3), [
          { label: String(correctVal), correct: true, why: `Δx · [f(x₁)+f(x₂)+f(x₃)+f(x₄)] computed at right endpoints.` },
          { label: String(wrong1),     why: 'That is the LEFT sum (uses x₀..x₃).' },
          { label: String(wrong2),     why: 'Off by one Δx — likely added an extra term.' },
          { label: String(wrong3),     why: 'That is the EXACT integral, not the Riemann sum.' },
        ]),
        onPick: handlePick(1),
      });
    } else {
      stepNode = mcqCard({
        stepLabel: 'Step 3 — exact value via FTC', promptTex: `\\int_{${p.a}}^{${p.b}} ${p.fLabel.replace('f(x) = ', '')}\\,dx = F(${p.b}) - F(${p.a}) \\text{ where } F(x) = ${p.Ftex}`,
        choices: shuffle(mulberry32(probIdx * 11 + 5), [
          { tex: p.exactTex, correct: true, why: `F(${p.b}) − F(${p.a}) gives the exact area.` },
          { label: '0', why: 'Plug in both bounds and subtract; you got 0 by mistake.' },
          { label: String(round(p.exact * 2, 4)), why: 'Double-counted somewhere.' },
          { label: String(round(p.exact / 2, 4)), why: 'Off by a factor of 2 — check the antiderivative.' },
        ]),
        onPick: handlePick(2),
      });
    }
    stepNode.className = ''; stepNode.style.padding = '0';
    card.appendChild(stepNode);
    view.appendChild(card);

    function handlePick(idx) {
      return (info) => {
        const updated = ctx.recordStep('q4', info.correct);
        ctx.score.correct = updated.correct; ctx.score.total = updated.totalSteps;
        ctx.refreshScore();
        perStep[idx] = info.correct ? 'done' : 'wrong';
        const row = el('div', { class: 'row' });
        if (idx < 2) {
          row.appendChild(el('button', { class: 'btn', text: 'Next step', onclick: () => { stepIdx = idx + 1; render(); } }));
        } else {
          ctx.recordProblemDone('q4');
          card.appendChild(finalBanner({ ansTex: p.exactTex, verifyText: `Compare to your sums above. As n → ∞ the Riemann sum approaches this value.` }));
          row.appendChild(el('button', { class: 'btn', text: 'Next problem', onclick: () => { probIdx += 1; stepIdx = 0; perStep = []; n = 4; render(); } }));
          row.appendChild(el('button', { class: 'btn alt', text: 'Dashboard', onclick: () => window.location.reload() }));
        }
        stepNode.appendChild(row);
      };
    }
  }

  render();
}

function drawRiemann(canvas, p, n, side) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height, pad = 28;
  const xmin = p.a - 0.5, xmax = p.b + 0.5;
  // Compute y range from f
  let ymin = 0, ymax = 0;
  for (let i = 0; i <= 80; i++) {
    const x = xmin + (xmax - xmin) * (i / 80);
    const y = p.f(x);
    if (y > ymax) ymax = y; if (y < ymin) ymin = y;
  }
  ymin = Math.min(0, ymin); ymax = Math.max(1, ymax * 1.1);
  const sx = x => pad + (x - xmin) / (xmax - xmin) * (W - 2 * pad);
  const sy = y => H - pad - (y - ymin) / (ymax - ymin) * (H - 2 * pad);

  ctx.clearRect(0, 0, W, H);

  // grid + axes
  ctx.strokeStyle = '#eee'; ctx.lineWidth = 0.5;
  for (let gx = Math.ceil(xmin); gx <= Math.floor(xmax); gx++) {
    ctx.beginPath(); ctx.moveTo(sx(gx), sy(ymin)); ctx.lineTo(sx(gx), sy(ymax)); ctx.stroke();
  }
  for (let gy = Math.ceil(ymin); gy <= Math.floor(ymax); gy++) {
    ctx.beginPath(); ctx.moveTo(sx(xmin), sy(gy)); ctx.lineTo(sx(xmax), sy(gy)); ctx.stroke();
  }
  ctx.strokeStyle = '#888'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(sx(xmin), sy(0)); ctx.lineTo(sx(xmax), sy(0)); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(sx(0), sy(ymin)); ctx.lineTo(sx(0), sy(ymax)); ctx.stroke();

  // rectangles
  const dx = (p.b - p.a) / n;
  for (let i = 0; i < n; i++) {
    const xL = p.a + i * dx;
    const xR = xL + dx;
    const xk = side === 'left' ? xL : xR;
    const yk = p.f(xk);
    if (!isFinite(yk)) continue;
    const top = Math.min(sy(yk), sy(0));
    const bot = Math.max(sy(yk), sy(0));
    ctx.fillStyle = 'rgba(26,115,232,0.18)';
    ctx.strokeStyle = 'rgba(26,115,232,0.6)';
    ctx.lineWidth = 1;
    ctx.fillRect(sx(xL), top, sx(xR) - sx(xL), bot - top);
    ctx.strokeRect(sx(xL), top, sx(xR) - sx(xL), bot - top);
  }
  // curve
  ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 1.6;
  ctx.beginPath();
  for (let i = 0; i <= 200; i++) {
    const x = p.a + (p.b - p.a) * (i / 200);
    const y = p.f(x);
    const X = sx(x), Y = sy(y);
    if (i === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
  }
  ctx.stroke();
  // ticks for a, b
  ctx.fillStyle = '#555'; ctx.font = '10px ui-monospace';
  ctx.fillText(String(p.a), sx(p.a) - 6, sy(0) + 12);
  ctx.fillText(String(p.b), sx(p.b) - 6, sy(0) + 12);
}
