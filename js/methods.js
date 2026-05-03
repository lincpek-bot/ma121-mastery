// Per-mode "How to do this" content. Shown collapsibly above each drill.
// Keep brief — formula + 3-6 step recipe + one common gotcha.

export const METHODS = {
  q1: {
    title: 'How to read the graph',
    body: `
<ol>
  <li><b>Limit at <span data-tex="x=a"></span> from a side:</b> follow the curve toward <span data-tex="a"></span> from that side; the y-value the curve approaches is the limit.</li>
  <li><b>Two-sided limit exists</b> only if left = right.</li>
  <li><b>Continuous at <span data-tex="a"></span></b>: limit exists AND <span data-tex="f(a)"></span> exists AND they're equal.</li>
  <li><b>Hole</b>: limit exists, <span data-tex="f(a)"></span> doesn't (or differs). Removable discontinuity.</li>
  <li><b>Jump</b>: left ≠ right, both finite. Limit DNE.</li>
  <li><b>Vertical asymptote</b>: limit goes to <span data-tex="\\pm\\infty"></span>. Limit DNE (technically).</li>
  <li><b>Horizontal asymptote</b>: <span data-tex="\\lim_{x\\to\\pm\\infty} f(x) = L"></span>.</li>
</ol>
<p><b>Gotcha:</b> open circle ≠ no limit. The limit can exist even if <span data-tex="f(a)"></span> is undefined.</p>`,
  },
  q2: {
    title: 'Derivative rules',
    body: `
<ul>
  <li><b>Power:</b> <span data-tex="\\frac{d}{dx}[x^n] = n x^{n-1}"></span></li>
  <li><b>Exp:</b> <span data-tex="\\frac{d}{dx}[e^x]=e^x,\\ \\ \\frac{d}{dx}[a^x]=a^x\\ln a"></span></li>
  <li><b>Log:</b> <span data-tex="\\frac{d}{dx}[\\ln x] = \\tfrac{1}{x}"></span></li>
  <li><b>Chain:</b> <span data-tex="\\frac{d}{dx}[f(g(x))] = f'(g(x))\\cdot g'(x)"></span></li>
  <li><b>Product:</b> <span data-tex="(uv)' = u'v + uv'"></span></li>
  <li><b>Quotient:</b> <span data-tex="\\left(\\tfrac{u}{v}\\right)' = \\tfrac{u'v - uv'}{v^2}"></span> (low d-high minus high d-low, over low squared)</li>
</ul>
<p><b>Gotcha:</b> chain rule applies even to <span data-tex="e^{\\text{stuff}}"></span> and <span data-tex="\\ln(\\text{stuff})"></span> — multiply by inner derivative.</p>`,
  },
  q3: {
    title: 'Antiderivatives + u-sub',
    body: `
<ul>
  <li><b>Power rule (reverse):</b> <span data-tex="\\int x^n\\,dx = \\tfrac{x^{n+1}}{n+1} + C"></span> (for <span data-tex="n\\neq -1"></span>)</li>
  <li><b>Special:</b> <span data-tex="\\int \\tfrac{1}{x}\\,dx = \\ln|x| + C,\\quad \\int e^x\\,dx = e^x + C"></span></li>
</ul>
<p><b>U-sub recipe:</b></p>
<ol>
  <li>Pick <span data-tex="u"></span> = the inside function (whose derivative is sitting nearby).</li>
  <li>Compute <span data-tex="du = u'\\,dx"></span>, solve for <span data-tex="dx"></span>.</li>
  <li>Substitute — the integral should be in <span data-tex="u"></span> only.</li>
  <li>Integrate, then plug <span data-tex="u"></span> back.</li>
</ol>
<p><b>Pick <span data-tex="u"></span> as:</b> the thing inside parentheses, the exponent, the inside of a root, or what's under a fraction bar.</p>`,
  },
  q4: {
    title: 'Riemann sums + FTC',
    body: `
<p><b>Riemann sum setup:</b> width <span data-tex="\\Delta x = \\tfrac{b-a}{n}"></span>. Sum <span data-tex="\\sum f(x_i^*)\\,\\Delta x"></span>.</p>
<ul>
  <li><b>Left sum:</b> use left endpoint of each subinterval, <span data-tex="x_i^* = a + i\\Delta x"></span> for <span data-tex="i=0,\\dots,n-1"></span>.</li>
  <li><b>Right sum:</b> use right endpoint, <span data-tex="i=1,\\dots,n"></span>.</li>
</ul>
<p><b>Over- vs underestimate:</b></p>
<ul>
  <li><b>Increasing function:</b> left = under, right = over.</li>
  <li><b>Decreasing function:</b> left = over, right = under.</li>
</ul>
<p><b>FTC Part 2:</b> <span data-tex="\\int_a^b f(x)\\,dx = F(b) - F(a)"></span> where <span data-tex="F'=f"></span>. Use this to verify your sum's true value.</p>`,
  },
  q5: {
    title: 'Full rational function analysis',
    body: `
<p>For <span data-tex="f(x) = \\tfrac{p(x)}{q(x)}"></span>, walk through these in order:</p>
<ol>
  <li><b>Domain:</b> exclude <span data-tex="x"></span> where <span data-tex="q(x)=0"></span>.</li>
  <li><b>Intercepts:</b> y-int <span data-tex="= f(0)"></span>; x-int where <span data-tex="p(x)=0"></span> (and <span data-tex="q(x)\\neq 0"></span>).</li>
  <li><b>Vertical asymptotes:</b> where <span data-tex="q(x)=0"></span> and <span data-tex="p(x)\\neq 0"></span>. (Same root in both = hole.)</li>
  <li><b>Horizontal asymptote:</b> compare degrees. <span data-tex="\\deg p < \\deg q \\Rightarrow y=0"></span>; equal <span data-tex="\\Rightarrow"></span> ratio of leading coeffs; <span data-tex="\\deg p > \\deg q \\Rightarrow"></span> none (slant possible).</li>
  <li><b>First derivative:</b> use quotient rule. Critical points where <span data-tex="f'=0"></span> or undefined. Sign chart on intervals split by criticals + VAs gives increasing/decreasing.</li>
  <li><b>Second derivative:</b> sign chart split by where <span data-tex="f''=0"></span> or undefined. Concave up where <span data-tex="f''>0"></span>, down where <span data-tex="f''<0"></span>. Inflection where concavity changes (and point exists).</li>
</ol>
<p><b>Gotcha:</b> always include the VAs in your sign chart intervals — sign can flip across them.</p>`,
  },
  q6: {
    title: "L'Hôpital's Rule",
    body: `
<p><b>Step 1 — verify the form is indeterminate:</b></p>
<ul>
  <li>Direct substitution gives <span data-tex="\\tfrac{0}{0}"></span> or <span data-tex="\\tfrac{\\infty}{\\infty}"></span>? L'Hôpital applies.</li>
  <li>Anything else (e.g., <span data-tex="\\tfrac{0}{5}=0"></span>, <span data-tex="\\tfrac{5}{0}=\\text{DNE}"></span>) — just answer it directly.</li>
</ul>
<p><b>Step 2 — apply:</b> <span data-tex="\\lim \\tfrac{f(x)}{g(x)} = \\lim \\tfrac{f'(x)}{g'(x)}"></span>. Differentiate top and bottom <i>separately</i> — NOT the quotient rule.</p>
<p><b>Step 3 — re-evaluate.</b> Still indeterminate? Apply again. Repeat until you get a real value.</p>
<p><b>Gotcha:</b> never apply L'Hôpital to a non-indeterminate form — you'll get the wrong answer.</p>`,
  },
  q7: {
    title: 'Optimization',
    body: `
<ol>
  <li><b>Objective:</b> write the quantity you're maximizing/minimizing as a formula (area, volume, cost, etc.).</li>
  <li><b>Constraint:</b> write the equation linking the variables (perimeter, total material, fixed sum, etc.).</li>
  <li><b>Eliminate</b> one variable: solve the constraint for one variable, substitute into the objective. Now it's a function of one variable.</li>
  <li><b>Differentiate, set <span data-tex="=0"></span>,</b> solve for the critical point.</li>
  <li><b>Verify it's a max/min</b> (second derivative test or endpoint check).</li>
  <li><b>Plug back</b> to find the other variable and the optimal value.</li>
</ol>
<p><b>Common templates:</b> fence-with-wall (perimeter has 3 sides not 4), open box (no top), can/cylinder (V fixed, minimize S).</p>`,
  },
  q8: {
    title: 'FTC + average value',
    body: `
<p><b>FTC Part 2:</b> <span data-tex="\\int_a^b f(x)\\,dx = F(b) - F(a)"></span> where <span data-tex="F"></span> is any antiderivative of <span data-tex="f"></span>.</p>
<p><b>Properties:</b></p>
<ul>
  <li><span data-tex="\\int_a^b = -\\int_b^a"></span> (swap bounds, flip sign)</li>
  <li><span data-tex="\\int_a^a = 0"></span></li>
  <li><span data-tex="\\int_a^c = \\int_a^b + \\int_b^c"></span> (additivity)</li>
  <li><span data-tex="\\int (cf) = c\\int f"></span></li>
</ul>
<p><b>U-sub with bounds:</b> when you switch to <span data-tex="u"></span>, also convert the bounds: <span data-tex="x=a \\to u=u(a)"></span>, etc. Then evaluate in <span data-tex="u"></span> directly — no need to switch back.</p>
<p><b>Average value:</b> <span data-tex="\\bar f = \\tfrac{1}{b-a}\\int_a^b f(x)\\,dx"></span>. Compute the integral, then divide by the interval width.</p>`,
  },
};
