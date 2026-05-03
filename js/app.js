// Router + dashboard + persistence.
import { el, clear } from './ui.js';
import { texFill } from './katex-helper.js';

const STORE_KEY = 'ma121:v1';
const view = document.getElementById('view');

const MODES = [
  { id: 'q1', file: 'q1-graphs',       q: 'Q1', stars: 3, title: 'Graph Reading',          sub: 'Limits, continuity, asymptotes, holes' },
  { id: 'q2', file: 'q2-derivatives',  q: 'Q2', stars: 2, title: 'Derivatives',            sub: 'Power, exp, log, chain, product, quotient' },
  { id: 'q3', file: 'q3-integrals',    q: 'Q3', stars: 2, title: 'Indefinite Integrals',   sub: 'Antiderivatives + u-substitution' },
  { id: 'q4', file: 'q4-riemann',      q: 'Q4', stars: 3, title: 'Riemann Sums + FTC',     sub: 'Left/right sums, over/underestimate, FTC verify' },
  { id: 'q5', file: 'q5-rational',     q: 'Q5', stars: 5, title: 'Rational Function (full)', sub: 'Domain → intercepts → asymptotes → f′ → f′′' },
  { id: 'q6', file: 'q6-lhopital',     q: 'Q6', stars: 3, title: "L'Hôpital's Rule",       sub: 'Verify form, then differentiate top/bottom' },
  { id: 'q7', file: 'q7-optimization', q: 'Q7', stars: 3, title: 'Optimization',           sub: 'Fence / box / cost word problems' },
  { id: 'q8', file: 'q8-ftc-avg',      q: 'Q8', stars: 4, title: 'FTC + Average Value',    sub: 'Definite integrals, properties, u-sub, average' },
];

const state = load();

function load() {
  const blank = () => ({ seen: 0, correct: 0, totalSteps: 0 });
  const valid = (s) => s && typeof s === 'object' &&
    Number.isFinite(s.seen) && Number.isFinite(s.correct) && Number.isFinite(s.totalSteps);
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
    const perMode = {};
    MODES.forEach((m) => {
      const got = raw.perMode && raw.perMode[m.id];
      perMode[m.id] = valid(got) ? got : blank();
    });
    return { perMode };
  } catch (e) {
    return { perMode: Object.fromEntries(MODES.map((m) => [m.id, blank()])) };
  }
}
export function save() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
export function recordStep(modeId, correct) {
  const s = state.perMode[modeId];
  s.totalSteps += 1;
  if (correct) s.correct += 1;
  save();
  return s;
}
export function recordProblemDone(modeId) {
  state.perMode[modeId].seen += 1;
  save();
}
export function modeScore(modeId) {
  const s = state.perMode[modeId];
  return { correct: s.correct, total: s.totalSteps, seen: s.seen };
}

function stars(n) { return '★'.repeat(n) + '☆'.repeat(5 - n); }

function dashboard() {
  clear(view);
  const intro = el('div', { class: 'dash-intro' }, [
    el('h1', { text: 'Drill the 8 question types until they’re automatic.' }),
    el('p',  { text: 'No-calculator final, cumulative, 2 hours. Q5 alone is 20 points — start there if you only have one session left.' }),
  ]);
  view.appendChild(intro);

  const grid = el('div', { class: 'mode-grid' });
  MODES.forEach((m) => {
    const sc = modeScore(m.id);
    const pct = sc.total ? Math.round((sc.correct / sc.total) * 100) : 0;
    const card = el('button', { class: 'mode-card', type: 'button' });
    card.appendChild(el('div', { class: 'mc-top' }, [
      el('div', { class: 'mc-q', text: m.q }),
      el('div', { class: 'mc-stars', text: stars(m.stars) }),
    ]));
    card.appendChild(el('h3', { text: m.title }));
    card.appendChild(el('p', { text: m.sub }));
    const bar = el('div', { class: 'bar' }, [el('span', { style: `width:${pct}%` })]);
    card.appendChild(el('div', { class: 'mc-stats' }, [
      bar,
      el('div', { text: `${pct}% · ${sc.seen} done` }),
    ]));
    card.addEventListener('click', () => loadMode(m));
    grid.appendChild(card);
  });
  view.appendChild(grid);
}

async function loadMode(m) {
  clear(view);
  view.appendChild(el('div', { class: 'card', text: 'Loading…' }));
  try {
    const mod = await import(`./modes/${m.file}.js`);
    clear(view);
    mod.mount(view, { meta: m, score: modeScore(m.id), recordStep, recordProblemDone, refreshScore: () => {
      const head = view.querySelector('.score-pill');
      if (head) {
        const s = modeScore(m.id);
        head.textContent = `Score ${s.correct}/${s.total}`;
      }
    }});
  } catch (e) {
    console.error(e);
    clear(view);
    view.appendChild(el('div', { class: 'card', text: 'This mode failed to load: ' + e.message }));
  }
}

function slug(s) {
  return s.toLowerCase()
    .replace(/[′]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

document.getElementById('home-link').addEventListener('click', dashboard);
document.getElementById('home-link').addEventListener('keypress', (e) => { if (e.key === 'Enter') dashboard(); });
document.getElementById('reset-btn').addEventListener('click', () => {
  if (confirm('Reset all progress? This cannot be undone.')) {
    localStorage.removeItem(STORE_KEY);
    Object.keys(state.perMode).forEach((k) => state.perMode[k] = { seen: 0, correct: 0, totalSteps: 0 });
    dashboard();
  }
});

dashboard();
