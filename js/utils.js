const $ = (s, r = document) => r.querySelector(s);
const h = (t, a = {}, ...k) => { const e = document.createElement(t); for (const [n, v] of Object.entries(a)) { if (n === 'class') e.className = v; else if (n.startsWith('on')) e.addEventListener(n.slice(2), v); else e.setAttribute(n, v) } k.flat().forEach(c => e.append(c)); return e };
const NS = 'http://www.w3.org/2000/svg';
const ic = (d, s = 20) => { const v = document.createElementNS(NS, 'svg');['viewBox:0 0 24 24', 'fill:none', 'stroke:currentColor', 'stroke-width:2', 'stroke-linecap:round', 'stroke-linejoin:round', 'width:' + s, 'height:' + s, 'aria-hidden:true'].forEach(x => { const [a, b] = x.split(':'); v.setAttribute(a, b) }); const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); v.append(p); return v };
const I = { menu: 'M4 6h16M4 12h16M4 18h16', x: 'M6 6l12 12M18 6L6 18', search: 'M21 21l-4.3-4.3M11 18a7 7 0 100-14 7 7 0 000 14z', sun: 'M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6L4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 17a5 5 0 100-10 5 5 0 000 10z', moon: 'M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z', up: 'M12 19V5M5 12l7-7 7 7' };
const C = {
  btn: 'inline-flex items-center justify-center min-h-11 px-5 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 dark:bg-zinc-200 dark:text-zinc-900 dark:hover:bg-zinc-300 font-medium transition-colors',
  btn2: 'inline-flex items-center justify-center min-h-11 px-5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium transition-colors',
  card: 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg',
  mute: 'text-zinc-500 dark:text-zinc-400',
  input: 'w-full min-h-11 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900',
  wrap: 'mx-auto w-full max-w-6xl px-4 sm:px-6'
};
const fmt = d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
const emailOk = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const link = p => 'blog-details.html?slug=' + encodeURIComponent(p.slug);
const meta = p => `${p.author} · ${fmt(p.date)} · ${p.read} min read`;
const setMeta = (k, v, a = 'name') => { let m = $(`meta[${a}="${k}"]`); if (!m) { m = h('meta', { [a]: k }); document.head.append(m) } m.setAttribute('content', v) };
const cover = p => h('img', { src: `https://picsum.photos/seed/${p.img}/1200/675`, alt: `Cover image for ${p.title}`, loading: 'lazy', class: 'w-full h-full object-cover', onerror: e => e.target.remove() });

/* theme */
const theme = {
  get: () => document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  set(t) { document.documentElement.classList.toggle('dark', t === 'dark'); try { localStorage.setItem('theme', t) } catch (e) { } document.querySelectorAll('[data-theme-btn]').forEach(b => { b.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'); b.setAttribute('aria-pressed', t === 'dark') }) },
  btn() { const b = h('button', { type: 'button', 'data-theme-btn': '', class: 'inline-flex items-center justify-center w-11 h-11 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800', onclick: () => theme.set(theme.get() === 'dark' ? 'light' : 'dark') }); const a = ic(I.sun), m = ic(I.moon); a.classList.add('hidden', 'dark:block'); m.classList.add('dark:hidden'); b.append(a, m); return b }
};

/* header */
function mountHeader(site) {
  const page = location.pathname.split('/').pop() || 'index.html';
  const lk = (n, c) => h('a', { href: n.href, class: c + ' rounded-lg px-3 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 ' + (page === n.href ? 'font-semibold' : C.mute), ...(page === n.href ? { 'aria-current': 'page' } : {}) }, n.label);
  const mob = h('div', { id: 'mnav', class: 'hidden md:hidden border-t border-zinc-200 dark:border-zinc-800 px-4 py-3 flex flex-col gap-1' }, ...site.nav.map(n => lk(n, 'block min-h-11 flex items-center')), h('div', { class: 'flex items-center gap-2 pt-2' }, theme.btn(), h('span', { class: C.mute + ' text-sm' }, 'Theme')));
  const tog = h('button', { type: 'button', 'aria-label': 'Open menu', 'aria-expanded': 'false', 'aria-controls': 'mnav', class: 'md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800' }, ic(I.menu));
  const close = () => { mob.classList.add('hidden'); tog.setAttribute('aria-expanded', 'false'); tog.setAttribute('aria-label', 'Open menu') };
  tog.onclick = () => { const o = mob.classList.toggle('hidden') === false; tog.setAttribute('aria-expanded', o); tog.setAttribute('aria-label', o ? 'Close menu' : 'Open menu') };
  mob.addEventListener('click', e => { if (e.target.closest('a')) close() });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { close(); tog.focus() } });
  const sf = h('form', { role: 'search', class: 'hidden lg:flex items-center', action: 'blog.html' }, h('label', { for: 'hs', class: 'sr-only' }, 'Search articles'), h('input', { id: 'hs', name: 'q', type: 'search', placeholder: 'Search…', class: C.input + ' w-44 !min-h-10' }));
  $('#header').replaceWith(h('header', { class: 'sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800 bg-stone-50/90 dark:bg-zinc-950/90 backdrop-blur' },
    h('div', { class: C.wrap + ' flex items-center justify-between h-16 gap-3' },
    (() => {
      const logo = h('a', {
        href: 'index.html',
        class: 'flex items-center shrink-0',
        'aria-label': site.name
      });
      const renderLogo = () => {
        const isDark = document.documentElement.classList.contains('dark');
        logo.innerHTML = isDark
          ? (site['logo-dark'] || site.logo)
          : site.logo;
        const svg = logo.querySelector('svg');
        if (svg) {
          svg.removeAttribute('width');
          svg.removeAttribute('height');
          svg.classList.add('w-auto', 'h-10', 'max-w-[170px]');
          svg.setAttribute('role', 'img');
          svg.setAttribute('aria-label', site.name);
        }
      };
      renderLogo();
      const observer = new MutationObserver(renderLogo);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
      return logo;
    })(),
    h('nav', { 'aria-label': 'Main', class: 'hidden md:flex items-center gap-1' }, ...site.nav.map(n => lk(n, ''))),
    h('div', { class: 'flex items-center gap-1' }, sf, h('a', { href: 'blog.html?focus=1', 'aria-label': 'Search articles', class: 'lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800' }, ic(I.search)), h('span', { class: 'hidden md:block' }, theme.btn()), tog)), mob));
  theme.set(theme.get());
}

/* footer */
function mountFooter(site) {
  $('#footer').replaceWith(h('footer', { class: 'mt-16 border-t border-zinc-200 dark:border-zinc-800' }, h('div', { class: C.wrap + ' py-10 grid gap-8 md:grid-cols-3' },
    h('div', {}, h('p', { class: 'font-semibold text-lg' }, site.name), h('p', { class: C.mute + ' mt-2 text-sm max-w-xs' }, site.tagline)),
    h('nav', { 'aria-label': 'Footer', class: 'flex flex-col gap-1 text-sm' }, ...site.nav.map(n => h('a', { href: n.href, class: 'hover:underline py-1' }, n.label))),
    h('div', { class: 'flex flex-col gap-1 text-sm' }, ...site.social.map(s => h('a', { href: s.href, target: '_blank', rel: 'noopener noreferrer', class: 'hover:underline py-1' }, s.label)))),
    h('div', { class: C.wrap + ' pb-8 flex items-center justify-between text-sm ' + C.mute }, h('p', {}, `© ${new Date().getFullYear()} ${site.name}. All rights reserved.`),
      h('button', { type: 'button', 'aria-label': 'Back to top', class: 'inline-flex items-center justify-center w-11 h-11 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800', onclick: () => scrollTo({ top: 0 }) }, ic(I.up)))));
}
/* blog card */
const card = p => {
  const a = link(p); return h('article', { class: C.card + ' overflow-hidden flex flex-col hover:shadow-md transition-shadow' },
    h('a', { href: a, tabindex: '-1', 'aria-hidden': 'true', class: 'block aspect-video bg-zinc-200 dark:bg-zinc-800' }, cover(p)),
    h('div', { class: 'p-5 flex flex-col gap-2 grow' }, h('span', { class: 'text-xs font-medium ' + C.mute }, p.category),
      h('h3', { class: 'text-lg font-semibold leading-snug break-words' }, h('a', { href: a, class: 'hover:underline' }, p.title)),
      h('p', { class: C.mute + ' text-sm' }, p.excerpt), h('p', { class: 'mt-auto pt-3 text-xs ' + C.mute }, meta(p)), h('a', { href: a, class: 'text-sm font-medium underline' }, 'Read more')))
};
/* newsletter */
function newsletter() {
  const i = h('input', { id: 'nl', type: 'email', required: '', placeholder: 'you@example.com', class: C.input, autocomplete: 'email' }), m = h('p', { class: 'text-sm mt-2', 'aria-live': 'polite' });
  const f = h('form', { novalidate: '', class: 'flex flex-col sm:flex-row gap-3 max-w-lg', onsubmit: e => { e.preventDefault(); if (!emailOk(i.value)) { m.textContent = 'Please enter a valid email address.'; m.className = 'text-sm mt-2 text-red-700 dark:text-red-400'; i.setAttribute('aria-invalid', 'true'); return } i.removeAttribute('aria-invalid'); m.className = 'text-sm mt-2'; m.textContent = 'Thanks! (Demo only: no email was actually stored.)'; f.reset() } },
    h('label', { for: 'nl', class: 'sr-only' }, 'Email address'), i, h('button', { class: C.btn, type: 'submit' }, 'Subscribe'));
  return h('div', {}, f, m)
}
