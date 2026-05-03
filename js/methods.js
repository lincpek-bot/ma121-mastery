// Per-mode "Method" — interactive walkthrough of one fully worked example.
// User clicks "Reveal step" to advance. Each step has a label + body (HTML with KaTeX via data-tex spans).

export const METHODS = {
  q1: {
    title: 'Worked example — reading a graph',
    intro: 'Suppose the graph shows: as x → 2 from the left the curve approaches y=3, from the right it approaches y=5, and there\'s an open circle at (2, 4). What do we say about limits and continuity at x=2?',
    steps: [
      { label: 'Step 1 · Left limit', body: 'Trace the curve toward x=2 from the left. The y-value it heads to is the left limit: <span data-tex="\\lim_{x\\to 2^-} f(x) = 3"></span>.' },
      { label: 'Step 2 · Right limit', body: 'Trace toward x=2 from the right: <span data-tex="\\lim_{x\\to 2^+} f(x) = 5"></span>.' },
      { label: 'Step 3 · Two-sided limit', body: 'Left ≠ right, so <span data-tex="\\lim_{x\\to 2} f(x)"></span> <b>does not exist</b> (jump discontinuity).' },
      { label: 'Step 4 · Function value', body: 'The open circle at (2, 4) means <span data-tex="f(2) = 4"></span> (filled value at that x). If there were no filled point, f(2) would be undefined.' },
      { label: 'Step 5 · Continuity', body: 'Continuous needs limit exists AND <span data-tex="f(2)"></span> exists AND they match. Limit doesn\'t exist here, so <b>not continuous</b> at x=2.' },
    ],
    final: '<b>Method:</b> left limit, right limit, compare. Then check f(a). Continuous = limit exists + f(a) exists + equal.',
  },

  q2: {
    title: 'Worked example — chain + product rule',
    intro: 'Differentiate <span data-tex="f(x) = x^2 \\cdot e^{3x}"></span>.',
    steps: [
      { label: 'Step 1 · Recognize the structure', body: 'It\'s a <b>product</b> of two functions: <span data-tex="u = x^2"></span> and <span data-tex="v = e^{3x}"></span>. Use the product rule.' },
      { label: 'Step 2 · Differentiate each piece', body: '<span data-tex="u\' = 2x"></span>. For <span data-tex="v = e^{3x}"></span>, use the chain rule: <span data-tex="v\' = e^{3x} \\cdot 3 = 3e^{3x}"></span>.' },
      { label: 'Step 3 · Apply product rule', body: '<span data-tex="(uv)\' = u\'v + uv\'"></span><br><span data-tex="f\'(x) = (2x)(e^{3x}) + (x^2)(3e^{3x})"></span>' },
      { label: 'Step 4 · Simplify', body: 'Factor out <span data-tex="e^{3x}"></span> and <span data-tex="x"></span>: <span data-tex="f\'(x) = x e^{3x}(2 + 3x)"></span>.' },
    ],
    final: '<b>Method:</b> identify the structure first (sum/product/quotient/composition), apply the matching rule, chain-rule any composite pieces, simplify.',
  },

  q3: {
    title: 'Worked example — u-substitution',
    intro: 'Evaluate <span data-tex="\\int 2x(x^2 + 1)^5\\,dx"></span>.',
    steps: [
      { label: 'Step 1 · Pick u', body: 'The "inside" function is <span data-tex="x^2 + 1"></span> — its derivative <span data-tex="2x"></span> is sitting in the integrand. Let <span data-tex="u = x^2 + 1"></span>.' },
      { label: 'Step 2 · Find du', body: '<span data-tex="\\frac{du}{dx} = 2x \\Rightarrow du = 2x\\,dx"></span>. Lucky — the <span data-tex="2x\\,dx"></span> is already there.' },
      { label: 'Step 3 · Substitute', body: '<span data-tex="\\int 2x(x^2+1)^5\\,dx = \\int u^5\\,du"></span>' },
      { label: 'Step 4 · Integrate in u', body: '<span data-tex="\\int u^5\\,du = \\tfrac{u^6}{6} + C"></span>' },
      { label: 'Step 5 · Substitute back', body: '<span data-tex="\\tfrac{(x^2+1)^6}{6} + C"></span>' },
    ],
    final: '<b>Method:</b> spot the inside function whose derivative is nearby → set u = that → swap dx for du → integrate → put x back.',
  },

  q4: {
    title: 'Worked example — Riemann sum + FTC check',
    intro: 'Estimate <span data-tex="\\int_0^2 x^2\\,dx"></span> with a right Riemann sum, n = 4. Then compare to the true value via FTC.',
    steps: [
      { label: 'Step 1 · Width', body: '<span data-tex="\\Delta x = \\tfrac{b-a}{n} = \\tfrac{2-0}{4} = 0.5"></span>.' },
      { label: 'Step 2 · Right endpoints', body: 'Right sum uses <span data-tex="x_i = a + i\\Delta x"></span> for <span data-tex="i = 1, 2, 3, 4"></span>: x = 0.5, 1, 1.5, 2.' },
      { label: 'Step 3 · Sum f(x) · Δx', body: '<span data-tex="(0.5^2 + 1^2 + 1.5^2 + 2^2)(0.5) = (0.25 + 1 + 2.25 + 4)(0.5) = 3.75"></span>.' },
      { label: 'Step 4 · Verify with FTC', body: '<span data-tex="\\int_0^2 x^2\\,dx = \\tfrac{x^3}{3}\\Big|_0^2 = \\tfrac{8}{3} \\approx 2.667"></span>.' },
      { label: 'Step 5 · Over- or under-estimate?', body: 'Right sum (3.75) > true value (2.667). <span data-tex="x^2"></span> is <b>increasing</b> on [0, 2], and right sum on increasing function = <b>overestimate</b>. ✓' },
    ],
    final: '<b>Method:</b> Δx, list endpoints (left or right), sum f·Δx. FTC gives the truth. Increasing → right=over, left=under.',
  },

  q5: {
    title: 'Worked example — full analysis of a rational function',
    intro: 'Analyze <span data-tex="f(x) = \\dfrac{x^2}{x^2 - 4}"></span>.',
    steps: [
      { label: 'Step 1 · Domain', body: 'Denominator zero when <span data-tex="x^2 = 4 \\Rightarrow x = \\pm 2"></span>. Domain: <span data-tex="x \\neq \\pm 2"></span>.' },
      { label: 'Step 2 · Intercepts', body: 'y-int: <span data-tex="f(0) = 0/(-4) = 0"></span>. x-int: numerator zero at <span data-tex="x = 0"></span>. So one intercept: <b>(0, 0)</b>.' },
      { label: 'Step 3 · Vertical asymptotes', body: 'Where denom = 0 and numer ≠ 0: at <span data-tex="x = \\pm 2"></span>. Both are VAs.' },
      { label: 'Step 4 · Horizontal asymptote', body: 'Degrees equal (both 2). HA = ratio of leading coefficients = <span data-tex="1/1 = 1"></span>. So <span data-tex="y = 1"></span>.' },
      { label: 'Step 5 · First derivative', body: 'Quotient rule: <span data-tex="f\'(x) = \\dfrac{2x(x^2-4) - x^2(2x)}{(x^2-4)^2} = \\dfrac{-8x}{(x^2-4)^2}"></span>. Critical point: <span data-tex="x = 0"></span>.' },
      { label: 'Step 6 · Sign chart for f′', body: 'Intervals split by 0 and <span data-tex="\\pm 2"></span>. Denom <span data-tex="(x^2-4)^2"></span> always positive. Sign comes from <span data-tex="-8x"></span>: positive when x < 0, negative when x > 0. So f increasing on (-∞, -2) and (-2, 0), decreasing on (0, 2) and (2, ∞). <b>Local max at (0, 0).</b>' },
      { label: 'Step 7 · Second derivative + concavity', body: 'After more quotient-rule pain: <span data-tex="f\'\'(x) = \\dfrac{8(3x^2 + 4)}{(x^2-4)^3}"></span>. Numerator always positive. Sign of f″ = sign of <span data-tex="(x^2-4)^3"></span>: negative on (-2, 2), positive elsewhere. So <b>concave down on (-2, 2), concave up otherwise.</b>' },
    ],
    final: '<b>Method:</b> domain → intercepts → asymptotes (V then H) → f′ critical points + sign chart → f″ + sign chart. Always include VAs in sign chart intervals.',
  },

  q6: {
    title: "Worked example — L'Hôpital's Rule",
    intro: 'Evaluate <span data-tex="\\lim_{x\\to 0} \\dfrac{e^x - 1}{x}"></span>.',
    steps: [
      { label: 'Step 1 · Check the form', body: 'Plug in x = 0: top is <span data-tex="e^0 - 1 = 0"></span>, bottom is 0. Form is <span data-tex="\\tfrac{0}{0}"></span> — indeterminate. L\'Hôpital applies.' },
      { label: 'Step 2 · Differentiate top and bottom separately', body: '<span data-tex="\\frac{d}{dx}[e^x - 1] = e^x"></span>, <span data-tex="\\frac{d}{dx}[x] = 1"></span>. New limit: <span data-tex="\\lim_{x\\to 0} \\dfrac{e^x}{1}"></span>.' },
      { label: 'Step 3 · Re-evaluate', body: 'Plug in: <span data-tex="\\dfrac{e^0}{1} = \\dfrac{1}{1} = 1"></span>. Not indeterminate any more — done.' },
      { label: 'Step 4 · Final answer', body: '<span data-tex="\\lim_{x\\to 0} \\dfrac{e^x - 1}{x} = 1"></span>.' },
    ],
    final: '<b>Method:</b> verify <span data-tex="\\tfrac{0}{0}"></span> or <span data-tex="\\tfrac{\\infty}{\\infty}"></span> first → differentiate top and bottom (NOT quotient rule) → re-check. Repeat if still indeterminate.',
  },

  q7: {
    title: 'Worked example — fence-against-wall',
    intro: 'You have 100 ft of fence and a wall on one side. Build a rectangular pen using the wall as one side. Maximize area.',
    steps: [
      { label: 'Step 1 · Variables + objective', body: 'Let x = the side parallel to the wall, y = each of the two perpendicular sides. Maximize area: <span data-tex="A = xy"></span>.' },
      { label: 'Step 2 · Constraint', body: 'Wall covers one side, so fence covers x + 2y = 100.' },
      { label: 'Step 3 · Eliminate', body: 'Solve constraint for x: <span data-tex="x = 100 - 2y"></span>. Substitute: <span data-tex="A(y) = (100 - 2y)y = 100y - 2y^2"></span>. Now one variable.' },
      { label: 'Step 4 · Differentiate, set to 0', body: '<span data-tex="A\'(y) = 100 - 4y = 0 \\Rightarrow y = 25"></span>.' },
      { label: 'Step 5 · Verify max', body: '<span data-tex="A\'\'(y) = -4 < 0"></span>, so it\'s a max (concave down). ✓' },
      { label: 'Step 6 · Plug back', body: '<span data-tex="x = 100 - 2(25) = 50"></span>. Max area: <span data-tex="A = 50 \\cdot 25 = 1250"></span> sq ft.' },
    ],
    final: '<b>Method:</b> objective → constraint → eliminate one variable → differentiate → critical point → verify max/min → answer all parts asked.',
  },

  q8: {
    title: 'Worked example — definite integral with u-sub',
    intro: 'Evaluate <span data-tex="\\int_0^1 2x(x^2 + 1)^3\\,dx"></span>.',
    steps: [
      { label: 'Step 1 · Pick u', body: 'Let <span data-tex="u = x^2 + 1"></span>. Its derivative <span data-tex="2x"></span> is in the integrand.' },
      { label: 'Step 2 · du and bounds', body: '<span data-tex="du = 2x\\,dx"></span>. Convert bounds: <span data-tex="x = 0 \\to u = 1"></span>, <span data-tex="x = 1 \\to u = 2"></span>.' },
      { label: 'Step 3 · Rewrite', body: '<span data-tex="\\int_0^1 2x(x^2+1)^3\\,dx = \\int_1^2 u^3\\,du"></span>' },
      { label: 'Step 4 · Integrate', body: '<span data-tex="\\int_1^2 u^3\\,du = \\tfrac{u^4}{4}\\Big|_1^2 = \\tfrac{16}{4} - \\tfrac{1}{4} = \\tfrac{15}{4}"></span>' },
      { label: 'Step 5 · Final', body: '<span data-tex="\\int_0^1 2x(x^2+1)^3\\,dx = \\dfrac{15}{4}"></span>. (Average value if asked: <span data-tex="\\tfrac{1}{1-0}\\cdot \\tfrac{15}{4} = \\tfrac{15}{4}"></span>.)' },
    ],
    final: '<b>Method:</b> definite integral with u-sub — convert the bounds when you switch to u, then evaluate in u directly. Average value = <span data-tex="\\tfrac{1}{b-a}\\int_a^b f"></span>.',
  },
};
