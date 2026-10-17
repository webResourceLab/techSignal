/* Safe renderer: DOM nodes + textContent only; no innerHTML */
const safeUrl = (u, img) => { try { const x = new URL(u, location.href); return (img ? ['http:', 'https:'] : ['http:', 'https:', 'mailto:']).includes(x.protocol) ? x.href : null } catch (e) { return null } };
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
function inline(s) {
    const f = document.createDocumentFragment(); String(s ?? '').split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/).forEach(t => {
        if (!t) return; let m;
        if (m = t.match(/^\*\*(.+)\*\*$/)) f.append(h('strong', { class: 'font-semibold' }, m[1]));
        else if (m = t.match(/^\*(.+)\*$/)) f.append(h('em', {}, m[1]));
        else if (m = t.match(/^`(.+)`$/)) f.append(h('code', { class: 'px-1 rounded bg-zinc-200 dark:bg-zinc-800 text-[0.9em]' }, m[1]));
        else if (m = t.match(/^\[(.+)\]\((.+)\)$/)) { const u = safeUrl(m[2]); f.append(u ? h('a', { href: u, rel: 'noopener noreferrer', class: 'underline underline-offset-2 hover:no-underline' }, m[1]) : m[1]) }
        else f.append(t)
    }); return f
}
const hd = (t, c) => b => h(t, { id: slug(b.x), class: c }, inline(b.x));
const list = (t, c) => b => h(t, { class: c + ' mb-5 pl-6 space-y-1' }, ...(Array.isArray(b.items) ? b.items : []).map(x => h('li', {}, inline(x))));
const BLOCKS = {
    p: b => h('p', { class: 'mb-5' }, inline(b.x)),
    h2: hd('h2', 'text-2xl md:text-3xl font-semibold mt-10 mb-4 leading-tight'),
    h3: hd('h3', 'text-xl md:text-2xl font-semibold mt-8 mb-3'),
    h4: hd('h4', 'text-lg font-semibold mt-6 mb-2'),
    ul: list('ul', 'list-disc'), ol: list('ol', 'list-decimal'),
    blockquote: b => h('blockquote', { class: 'my-6 pl-5 border-l-4 border-zinc-400 dark:border-zinc-600 italic ' + C.mute }, inline(b.x)),
    code: b => h('pre', { class: 'my-6 p-4 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm' }, h('code', {}, String(b.x ?? ''))),
    hr: () => h('hr', { class: 'my-10 border-zinc-300 dark:border-zinc-700' }),
    img: b => { const u = safeUrl(b.src, true); if (!u) return null; return h('figure', { class: 'my-8' }, h('img', { src: u, alt: b.alt || '', loading: 'lazy', class: 'w-full rounded-lg', onerror: e => e.target.remove() }), b.cap ? h('figcaption', { class: 'text-sm mt-2 ' + C.mute }, b.cap) : '') }
};
function renderBody(blocks) { const f = document.createDocumentFragment(); (Array.isArray(blocks) ? blocks : []).forEach(b => { const fn = b && BLOCKS[b.t]; const n = fn ? fn(b) : (b && typeof b.x === 'string' ? h('p', { class: 'mb-5' }, b.x) : null); if (n) f.append(n) }); return f }
