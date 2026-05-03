// Wait for KaTeX to load (deferred CDN), then expose render helpers.
let kReady = null;
function ready() {
  if (kReady) return kReady;
  kReady = new Promise((resolve) => {
    if (window.katex) return resolve(window.katex);
    let elapsed = 0;
    const i = setInterval(() => {
      if (window.katex) { clearInterval(i); resolve(window.katex); return; }
      elapsed += 30;
      if (elapsed > 8000) {
        clearInterval(i);
        resolve({ renderToString: (s) => `<span style="font-family:ui-monospace,monospace">${s.replace(/[<>&]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</span>` });
      }
    }, 30);
  });
  return kReady;
}

export async function tex(str, opts = {}) {
  const k = await ready();
  return k.renderToString(str, { throwOnError: false, displayMode: !!opts.display, output: 'html' });
}

// Render any element containing data-tex attributes after insertion.
export async function texFill(root) {
  const k = await ready();
  root.querySelectorAll('[data-tex]').forEach((el) => {
    const display = el.dataset.display === '1';
    el.innerHTML = k.renderToString(el.dataset.tex, { throwOnError: false, displayMode: display, output: 'html' });
  });
}
