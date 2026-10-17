const PG = {};
const sec = (t, ...k) => h('section', { class: C.wrap + ' py-10 md:py-14' }, t ? h('h2', { class: 'text-2xl md:text-3xl font-semibold mb-6' }, t) : '', ...k);
const grid = (...k) => h('div', { class: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3' }, ...k);

PG.home = (app, { posts, cats }) => {
  const f = posts.find(p => p.featured) || posts[0];
  app.append(
    h('section', { class: C.wrap + ' py-12 md:py-20 grid lg:grid-cols-2 gap-10 items-center' },
      h('div', {}, h('h1', { class: 'text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight' }, 'Thoughtful writing on design, technology and work.'),
        h('p', { class: C.mute + ' mt-5 text-lg max-w-xl' }, 'Essays and practical tutorials for people who like to build things slowly and well.'),
        h('div', { class: 'mt-8 flex flex-wrap gap-3' }, h('a', { href: 'blog.html', class: C.btn }, 'Explore Articles'), h('a', { href: 'contact.html', class: C.btn2 }, 'Write to us'))),
      h('a', { href: link(f), class: C.card + ' overflow-hidden block hover:shadow-md transition-shadow' }, h('div', { class: 'aspect-video bg-zinc-200 dark:bg-zinc-800' }, cover(f)),
        h('div', { class: 'p-6' }, h('p', { class: 'text-xs font-medium ' + C.mute }, 'Featured · ' + f.category), h('h2', { class: 'text-xl md:text-2xl font-semibold mt-2 break-words' }, f.title), h('p', { class: C.mute + ' mt-2' }, f.excerpt), h('p', { class: 'text-xs mt-4 ' + C.mute }, meta(f))))),
    sec('Latest articles', grid(...posts.slice(0, 6).map(card)), h('div', { class: 'mt-8 text-center' }, h('a', { href: 'blog.html', class: C.btn2 }, 'View All Articles'))),
    sec('Popular categories', h('div', { class: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-5' }, ...cats.map(c => h('a', { href: 'blog.html?cat=' + encodeURIComponent(c.name), class: C.card + ' p-4 hover:shadow-md transition-shadow' }, h('p', { class: 'font-semibold' }, c.name), h('p', { class: C.mute + ' text-sm mt-1' }, c.desc), h('p', { class: 'text-xs mt-3 ' + C.mute }, posts.filter(p => p.category === c.name).length + ' articles'))))),
    sec('', h('div', { class: C.card + 'p-6 md:p-10 grid justify-items-center' }, h('h2', { class: 'text-2xl font-semibold' }, 'Get the weekly digest'), h('p', { class: C.mute + ' mt-2 mb-5' }, 'One email a week. No spam, unsubscribe anytime.'), newsletter())),
    sec('', h('div', { class: 'flex flex-col sm:flex-row gap-6 items-start' }, h('div', { class: 'w-20 h-20 shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-700 flex items-center justify-center text-2xl font-semibold', 'aria-hidden': 'true' }, 'F'),
      h('div', {}, h('h2', { class: 'text-2xl font-semibold' }, 'About TechSignal'), h('p', { class: C.mute + ' mt-2 max-w-2xl' }, 'TechSignal is written by a small team of developers who share technology and technical knowledge with the world.'), h('a', { href: 'contact.html', class: C.btn2 + ' mt-4' }, 'Contact us')))));
};

PG.blog = (app, { posts, cats }) => {
  const u = new URLSearchParams(location.search), s = { q: u.get('q') || '', cat: u.get('cat') || '', sort: 'new', n: 6 };
  const q = h('input', { id: 'q', type: 'search', placeholder: 'Search title, excerpt, category, tags…', class: C.input, value: s.q }),
    cat = h('select', { id: 'cat', class: C.input }, h('option', { value: '' }, 'All categories'), ...cats.map(c => h('option', { value: c.name }, c.name))),
    so = h('select', { id: 'so', class: C.input }, h('option', { value: 'new' }, 'Latest'), h('option', { value: 'old' }, 'Oldest'), h('option', { value: 'az' }, 'A–Z')),
    clr = h('button', { type: 'button', class: C.btn2 }, 'Clear filters'), count = h('p', { class: C.mute + ' mb-4', 'aria-live': 'polite' }), g = grid(), more = h('button', { type: 'button', class: C.btn2 }, 'Load more'), empty = h('p', { class: 'text-center py-16 ' + C.mute }, 'No articles match your filters. Try a different search or clear the filters.');
  cat.value = s.cat;
  const lab = (l, id, el) => h('div', {}, h('label', { for: id, class: 'block text-sm mb-1 ' + C.mute }, l), el);
  function draw() {
    const t = s.q.trim().toLowerCase();
    let r = posts.filter(p => (!s.cat || p.category === s.cat) && (!t || [p.title, p.excerpt, p.category, ...p.tags].join(' ').toLowerCase().includes(t)));
    r.sort((a, b) => s.sort === 'az' ? a.title.localeCompare(b.title) : s.sort === 'old' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
    g.replaceChildren(...r.slice(0, s.n).map(card));
    count.textContent = `${r.length} article${r.length === 1 ? '' : 's'} found`;
    empty.hidden = r.length > 0; more.hidden = s.n >= r.length; clr.hidden = !(s.q || s.cat || s.sort !== 'new');
  }
  q.oninput = () => { s.q = q.value; s.n = 6; draw() }; cat.onchange = () => { s.cat = cat.value; s.n = 6; draw() }; so.onchange = () => { s.sort = so.value; draw() };
  more.onclick = () => { s.n += 6; draw() }; clr.onclick = () => { s.q = s.cat = ''; s.sort = 'new'; q.value = ''; cat.value = ''; so.value = 'new'; s.n = 6; draw() };
  app.append(sec('', h('h1', { class: 'text-3xl md:text-5xl font-semibold tracking-tight' }, 'All articles'), h('p', { class: C.mute + ' mt-3 mb-8 max-w-2xl' }, 'Browse every essay and tutorial. Search by keyword or narrow by category.'),
    h('div', { class: 'grid gap-4 md:grid-cols-[2fr_1fr_1fr_auto] items-end mb-6' }, lab('Search', 'q', q), lab('Category', 'cat', cat), lab('Sort by', 'so', so), clr), count, g, empty, h('div', { class: 'mt-8 text-center' }, more)));
  draw(); if (u.get('focus')) q.focus();
};

PG.details = (app, { posts }) => {
  const sl = new URLSearchParams(location.search).get('slug'), i = posts.findIndex(p => p.slug === sl), p = posts[i];
  if (!p) { document.title = 'Article not found – TechSignal'; app.append(sec('', h('div', { class: 'text-center py-16' }, h('h1', { class: 'text-3xl font-semibold' }, 'Article not found'), h('p', { class: C.mute + ' mt-3 mb-6' }, 'The article you are looking for does not exist or was moved.'), h('a', { href: 'blog.html', class: C.btn }, 'Back to all articles')))); return }
  document.title = p.title + ' – TechSignal'; setMeta('description', p.excerpt); setMeta('og:title', p.title, 'property'); setMeta('og:description', p.excerpt, 'property'); setMeta('og:type', 'article', 'property'); setMeta('og:image', `https://picsum.photos/seed/${p.img}/1200/630`, 'property');
  const can = $('link[rel=canonical]'); if (can) can.href = location.origin + location.pathname + '?slug=' + p.slug;
  const bar = h('div', { class: 'fixed top-0 left-0 h-1 bg-zinc-700 dark:bg-zinc-300 z-50 w-0', 'aria-hidden': 'true' }); document.body.append(bar);
  addEventListener('scroll', () => { const d = document.documentElement; bar.style.width = Math.min(100, scrollY / (d.scrollHeight - innerHeight || 1) * 100) + '%' }, { passive: true });
  const heads = p.body.filter(b => b.t === 'h2');
  const toc = heads.length >= 3 ? h('nav', { 'aria-label': 'Table of contents', class: C.card + ' p-4 mb-8 text-sm' }, h('p', { class: 'font-semibold mb-2' }, 'In this article'), h('ul', { class: 'space-y-1' }, ...heads.map(b => h('li', {}, h('a', { href: '#' + slug(b.x), class: 'hover:underline' }, b.x))))) : '';
  const url = location.href, sh = (l, href, ex = {}) => h('a', { href, class: C.btn2 + ' !min-h-10 text-sm', ...ex }, l);
  const share = h('div', { class: 'flex flex-wrap gap-2 items-center' }, h('span', { class: 'text-sm ' + C.mute }, 'Share:'),
    sh('X', 'https://x.com/intent/tweet?text=' + encodeURIComponent(p.title) + '&url=' + encodeURIComponent(url), { target: '_blank', rel: 'noopener noreferrer' }),
    sh('LinkedIn', 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url), { target: '_blank', rel: 'noopener noreferrer' }),
    h('button', { type: 'button', class: C.btn2 + ' !min-h-10 text-sm', onclick: e => { navigator.clipboard?.writeText(url); e.target.textContent = 'Link copied' } }, 'Copy link'));
  const pv = posts[i + 1], nx = posts[i - 1], rel = posts.filter(x => x !== p).sort((a, b) => (b.category === p.category) - (a.category === p.category)).slice(0, 3);
  const nv = (l, x, al) => x ? h('a', { href: link(x), class: C.card + ' p-4 block hover:shadow-md transition-shadow ' + al }, h('span', { class: 'text-xs ' + C.mute }, l), h('span', { class: 'block font-medium break-words' }, x.title)) : h('span', {});
  app.append(h('article', { class: 'mx-auto w-full max-w-3xl px-4 sm:px-6 py-10' },
    h('a', { href: 'blog.html', class: 'text-sm underline ' + C.mute }, '← Back to blog'),
    h('p', { class: 'mt-6 text-sm font-medium ' + C.mute }, p.category),
    h('h1', { class: 'text-3xl md:text-5xl font-semibold tracking-tight leading-tight mt-2 break-words' }, p.title),
    h('p', { class: 'text-lg md:text-xl mt-4 ' + C.mute }, p.excerpt),
    h('div', { class: 'flex items-center gap-3 mt-6 text-sm' }, h('span', { class: 'w-10 h-10 rounded-full bg-zinc-300 dark:bg-zinc-700 flex items-center justify-center font-semibold', 'aria-hidden': 'true' }, p.author[0]), h('div', {}, h('p', { class: 'font-medium' }, p.author), h('p', { class: C.mute }, `${fmt(p.date)}${p.updated ? ' · Updated ' + fmt(p.updated) : ''} · ${p.read} min read`))),
    h('figure', { class: 'my-8' }, h('div', { class: 'aspect-video rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-800' }, cover(p)), h('figcaption', { class: 'text-sm mt-2 ' + C.mute }, p.caption || '')),
    toc, h('div', { class: 'text-[17px] md:text-lg leading-8' }, renderBody(p.body)),
    h('div', { class: 'flex flex-wrap gap-2 mt-8' }, ...p.tags.map(t => h('a', { href: 'blog.html?q=' + encodeURIComponent(t), class: 'text-sm px-3 py-1 rounded-full border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800' }, '#' + t))),
    h('div', { class: 'mt-6' }, share),
    h('div', { class: 'grid sm:grid-cols-2 gap-4 mt-10' }, nv('← Previous', pv, ''), nv('Next →', nx, 'sm:text-right')),
    h('section', { class: 'mt-14' }, h('h2', { class: 'text-2xl font-semibold mb-5' }, 'Related articles'), h('div', { class: 'grid gap-4' }, ...rel.map(x => nv(x.category, x, ''))))));
};

PG.contact = (app, { site }) => {
  const fl = (l, n, t = 'text') => { const e = h('p', { id: n + 'e', class: 'text-sm mt-1 text-red-700 dark:text-red-400', role: 'alert' }), i = n === 'message' ? h('textarea', { rows: '5', class: C.input + ' py-2' }) : h('input', { type: t, class: C.input }); i.id = n; i.name = n; i.setAttribute('aria-describedby', n + 'e'); return { i, e, w: h('div', {}, h('label', { for: n, class: 'block text-sm font-medium mb-1' }, l + ' *'), i, e) } };
  const F = ['name', 'email', 'subject', 'message'].map(n => fl(n[0].toUpperCase() + n.slice(1), n, n === 'email' ? 'email' : 'text')), st = h('p', { class: 'text-sm', 'aria-live': 'polite' });
  const form = h('form', {
    novalidate: '', class: C.card + ' p-6 grid gap-4', onsubmit: ev => {
      ev.preventDefault(); let ok = true;
      F.forEach(({ i, e }) => { let m = ''; const v = i.value.trim(); if (!v) m = 'This field is required.'; else if (i.id === 'email' && !emailOk(v)) m = 'Enter a valid email address.'; else if (i.id === 'message' && v.length < 10) m = 'Please write at least 10 characters.'; e.textContent = m; m ? i.setAttribute('aria-invalid', 'true') : i.removeAttribute('aria-invalid'); if (m) ok = false });
      if (!ok) { st.textContent = 'Please fix the highlighted fields.'; st.className = 'text-sm text-red-700 dark:text-red-400'; F.find(x => x.e.textContent).i.focus(); return }
      st.textContent = 'Form validated. This is a demo, so your message was not actually sent. Connect an email service in js/main.js.'; st.className = 'text-sm'; form.reset()
    }
  }, ...F.map(x => x.w), h('button', { class: C.btn, type: 'submit' }, 'Send message'), st);
  const c = site.contact, info = [['Email', c.email, 'mailto:' + c.email], ['Location', c.location], ['Response time', c.hours]];
  app.append(sec('', h('h1', { class: 'text-3xl md:text-5xl font-semibold tracking-tight' }, 'Contact'), h('p', { class: C.mute + ' mt-3 mb-8 max-w-2xl' }, 'Questions, pitches or feedback? Send a note and we will get back to you.'),
    h('div', { class: 'grid lg:grid-cols-[1fr_1.3fr] gap-8' }, h('div', { class: 'grid gap-4 content-start' }, ...info.map(([l, v, a]) => h('div', { class: C.card + ' p-4' }, h('p', { class: 'text-sm ' + C.mute }, l), a ? h('a', { href: a, class: 'font-medium underline break-all' }, v) : h('p', { class: 'font-medium' }, v))), h('div', { class: C.card + ' p-4' }, h('p', { class: 'text-sm mb-2 ' + C.mute }, 'Social'), h('div', { class: 'flex flex-wrap gap-3' }, ...site.social.map(s => h('a', { href: s.href, target: '_blank', rel: 'noopener noreferrer', class: 'underline' }, s.label))))), form)),
    sec('Frequently asked questions', h('div', { class: 'grid gap-3 max-w-3xl' }, ...site.faq.map(f => h('details', { class: C.card + ' p-4' }, h('summary', { class: 'cursor-pointer font-medium' }, f.q), h('p', { class: C.mute + ' mt-2' }, f.a))))));
};

(async () => {
  const app = $('#app');
  try {
    const [posts, cats, site] = await Promise.all(['posts', 'categories', 'site'].map(n => fetch(`data/${n}.json`).then(r => { if (!r.ok) throw 0; return r.json() })));
    posts.sort((a, b) => b.date.localeCompare(a.date));
    mountHeader(site); mountFooter(site); app.replaceChildren();
    PG[document.body.dataset.page](app, { posts, cats, site });
  } catch (e) { app.replaceChildren(h('p', { class: 'p-8 text-center' }, 'Could not load data. Please run the site through a local server (see README).')) }
})();
