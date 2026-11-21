(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ------------------------------------------------------------------
     Език
  ------------------------------------------------------------------ */
  const EN = {
    brand: 'Pod Lipite', since: 'since 1926', reserve: 'Reserve',
    n_farm: 'The farm', n_menu: 'Menu', n_events: 'Celebrations', n_gallery: 'Gallery', n_contact: 'Contact',
    i_eyebrow: 'Sofia · 1 Elin Pelin St.', i_t1: 'A hundred years', i_t2: 'under the lindens', i_scroll: 'Scroll to step inside',
    c1_t: 'The same gate', c1_p: 'Since 1926 people have been sitting down under the linden trees on this corner of Lozenets.',
    c2_t: 'The house', c2_p: 'Beams, woven rugs and a hearth. Nothing here is a stage set.',
    c3_t: 'Our own farm', c3_p: 'Almost everything that enters the kitchen, we raise ourselves.',
    c4_t: 'The fire', c4_p: 'The sach reaches your table still sizzling.',
    c5_t: 'The table', c5_p: 'Homemade lukanka, pastirma and bread straight from the oven.',
    e_eyebrow: 'Every day · 12:00 – 23:00', e_t: 'Your table is waiting', e_call: 'Call to reserve',
    s1: 'years of history', s2: 'seats in the two gardens', s3: 'seats on the terrace', s4: 'days a week',
    f_eyebrow: 'The farm', f_title: 'No middlemen between the field and your table',
    f_lead: 'We raise almost every product that goes into our kitchen. That is why the taste has stayed the same for decades.',
    f1_t: 'The grain', f1_p: 'Wheat, emmer, barley, millet, corn, oats. We mill them into flour for oven-baked bread and for sweet and savoury banitsa.',
    f2_t: 'The milk', f2_p: 'Certified organic fresh milk. We turn it into homemade yogurt, white cheese and kashkaval.',
    f3_t: 'The meat', f3_p: 'Meat, minced meat and sausages are made in-house: lukanka, pastirma, sudzhuk.',
    m_eyebrow: 'Menu', m_title: 'The true taste of Bulgarian cuisine', m_note: 'Prices are in euro. Weights are per portion.',
    ev_eyebrow: 'Celebrations', ev_title: 'Big days are remembered by the table',
    ev1_t: 'Weddings', ev1_p: 'By Bulgarian custom, with music and dancing.',
    ev2_t: 'Christenings', ev2_p: 'A feast for the whole family.',
    ev3_t: 'Corporate banquets', ev3_p: 'Business dinners in a bohemian setting.',
    ev4_t: 'Family occasions', ev4_p: 'Birthdays, name days, anniversaries.',
    g_eyebrow: 'Gallery', g_title: 'Moments kept in our notebook',
    k_eyebrow: 'Contact', k_title: 'Welcome', k_addr_l: 'Address', k_addr: '1 Elin Pelin St., 1164 Sofia',
    k_hours_l: 'Opening hours', k_hours: 'Monday – Sunday, 12:00 – 23:00', k_phone_l: 'Reservations', k_route: 'Get directions',
    tagline: 'Tradition with history since 1926', foot_note: 'Concept project. Photos and content: Pod Lipite restaurant.',
  };
  const BG = {};
  $$('[data-i]').forEach((el) => { if (!(el.dataset.i in BG)) BG[el.dataset.i] = el.textContent; });
  let lang = 'bg';
  try { lang = localStorage.getItem('lipite-lang') || 'bg'; } catch {}
  const T = { open: { bg: 'Отворено сега', en: 'Open now' }, closed: { bg: 'Затворено · отваряме в 12:00', en: 'Closed · we open at 12:00' }, g: { bg: 'г', en: 'g' } };

  function setLang(l) {
    lang = l;
    try { localStorage.setItem('lipite-lang', l); } catch {}
    document.documentElement.lang = l;
    const dict = l === 'en' ? EN : BG;
    $$('[data-i]').forEach((el) => { const v = dict[el.dataset.i]; if (v != null) el.textContent = v; });
    $$('.lang span').forEach((s) => s.classList.toggle('on', s.dataset.l === l));
    renderTabs(); renderMenu(); openNow();
  }
  $('.lang').addEventListener('click', () => setLang(lang === 'bg' ? 'en' : 'bg'));

  /* ------------------------------------------------------------------
     Снимки (от сайта на ресторанта)
  ------------------------------------------------------------------ */
  function setPhoto(img, file) {
    img.onerror = () => { img.style.visibility = 'hidden'; };
    img.onload = () => { img.style.visibility = ''; };
    img.src = window.PHOTO(file);
  }
  $$('img[data-ph]').forEach((img) => setPhoto(img, img.dataset.ph));

  /* ------------------------------------------------------------------
     Меню
  ------------------------------------------------------------------ */
  const MENU = window.MENU;
  const CAT_PHOTO = {
    salati: '98_Pod_lipite_s2_IMG_5958_thumb.jpg', topenici: '91_Pod_lipite_menu_thumb.jpg', supi: '164_Pod_lipite_s2_IMG_6039.jpg',
    mezeta: '94_Pod_lipite_s2_IMG_6027_thumb.jpg', podnici: '99_Pod_lipite_s2_IMG_5997_thumb.jpg', tiganici: '99_Pod_lipite_s2_IMG_5997_thumb.jpg',
    meso: '127_Pod_lipite_s2_IMG_6004.jpg', bezmeso: '177_Pod_lipite_s2_IMG_6056.jpg', skara: '127_Pod_lipite_s2_IMG_6004.jpg',
    sach: '124_Pod_lipite_s2_IMG_5948.jpg', deserti: '100_Pod_lipite_s2_IMG_6163.jpg', hlyab: '177_Pod_lipite_s2_IMG_6056.jpg',
  };
  let cat = 'sach';
  const tabs = $('.menu-tabs'), list = $('.menu-list'), mPhoto = $('.menu-photo img'), mCap = $('.menu-photo figcaption');
  function renderTabs() {
    tabs.innerHTML = '';
    MENU.forEach((c) => {
      const b = document.createElement('button');
      b.type = 'button'; b.textContent = c[lang]; b.className = c.id === cat ? 'on' : '';
      b.addEventListener('click', () => { cat = c.id; renderTabs(); renderMenu(true); });
      tabs.appendChild(b);
    });
  }
  function renderMenu(scrollTab) {
    const c = MENU.find((x) => x.id === cat);
    list.innerHTML = '';
    c.items.forEach((it, i) => {
      const li = document.createElement('li');
      li.style.setProperty('--i', i);
      const nm = document.createElement('span'); nm.className = 'nm'; nm.textContent = lang === 'en' ? it[1] : it[0];
      const pr = document.createElement('span'); pr.className = 'pr'; pr.textContent = it[3].toFixed(2).replace('.', lang === 'en' ? '.' : ',') + ' €';
      const gr = document.createElement('span'); gr.className = 'gr'; gr.textContent = it[2] + ' ' + T.g[lang];
      li.append(nm, pr, gr); list.appendChild(li);
    });
    mCap.textContent = c[lang];
    const f = CAT_PHOTO[cat];
    if (mPhoto.dataset.ph !== f) {
      mPhoto.dataset.ph = f;
      mPhoto.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: 'forwards' }).finished.then(() => {
        setPhoto(mPhoto, f);
        mPhoto.animate([{ opacity: 0, transform: 'scale(1.08)' }, { opacity: 1, transform: 'scale(1.02)' }], { duration: 900, easing: 'cubic-bezier(.2,.7,.1,1)', fill: 'forwards' });
      }).catch(() => setPhoto(mPhoto, f));
    }
    if (scrollTab) { const on = $('.on', tabs); if (on) tabs.scrollTo({ left: on.offsetLeft - 20, behavior: 'smooth' }); }
  }

  /* ------------------------------------------------------------------
     Галерия
  ------------------------------------------------------------------ */
  const GALLERY = ['125_Pod_lipite_s2_IMG_5823.jpg', '27_Pod_lipite_garden_thumb.jpg', '132_Pod_lipite_s2_IMG_5830_thumb.jpg', '124_Pod_lipite_s2_IMG_5948.jpg',
    '25_Pod_lipite_restaurant_thumb.jpg', '177_Pod_lipite_s2_IMG_6056.jpg', '97_Pod_lipite_s2_IMG_6217_thumb.jpg', '127_Pod_lipite_s2_IMG_6004.jpg',
    '153_Pod_lipite_farm2_thumb.jpg', '95_Pod_lipite_s2_IMG_6204_thumb.jpg'];
  const gGrid = $('.gallery-grid'), lb = $('.lightbox');
  GALLERY.forEach((f) => {
    const b = document.createElement('button'); b.type = 'button';
    const img = document.createElement('img'); img.loading = 'lazy'; img.alt = '';
    img.onerror = () => b.remove();
    img.src = window.PHOTO(f);
    b.appendChild(img);
    b.addEventListener('click', () => { $('img', lb).src = img.src; lb.hidden = false; });
    gGrid.appendChild(b);
  });
  lb.addEventListener('click', () => { lb.hidden = true; });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') lb.hidden = true; });

  /* ------------------------------------------------------------------
     Отворено ли е (по софийско време)
  ------------------------------------------------------------------ */
  function openNow() {
    const el = $('.open-now'); if (!el) return;
    let h = new Date().getHours();
    try { h = +new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Sofia', hour: 'numeric', hour12: false }).format(new Date()); } catch {}
    const yes = h >= 12 && h < 23;
    el.classList.toggle('yes', yes);
    $('span', el).textContent = (yes ? T.open : T.closed)[lang];
  }

  /* ------------------------------------------------------------------
     Появяване, броячи, паралакс, наклон
  ------------------------------------------------------------------ */
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    if (e.target.dataset.count) countUp(e.target);
  }), { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal, .ph, .gallery-grid button, [data-count]').forEach((el) => io.observe(el));

  function countUp(el) {
    const to = +el.dataset.count;
    if (reduce) { el.textContent = to; return; }
    const t0 = performance.now(), dur = 1800;
    (function step(t) {
      const k = clamp((t - t0) / dur); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 4)));
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  if (fine && !reduce) {
    $$('.tilt').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
        el.style.setProperty('--shine', 1);
      });
      el.addEventListener('pointerleave', () => { el.style.transition = 'transform .9s cubic-bezier(.2,.7,.1,1), clip-path 1.5s cubic-bezier(.2,.7,.1,1)'; el.style.transform = ''; el.style.setProperty('--shine', 0); });
      el.addEventListener('pointerenter', () => { el.style.transition = 'transform .15s, clip-path 1.5s cubic-bezier(.2,.7,.1,1)'; });
    });
    $$('.btn').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
      });
      b.addEventListener('pointerleave', () => { b.style.transform = ''; });
    });
  }

  /* ------------------------------------------------------------------
     Скрол филм
     Скролът задава целта, кадърът я догонва плавно. Съседните кадри и
     съседните сцени се преливат, за да няма насичане и резки смени.
  ------------------------------------------------------------------ */
  const film = $('.film'), stage = $('.film-stage'), canvas = $('.film-canvas'), ctx = canvas.getContext('2d', { alpha: false });
  const intro = $('.intro'), endCard = $('.film-end'), rail = $('.film-rail'), railYear = $('.rail-year'), railFill = $('.rail-track span');
  const nav = $('.nav'), fab = $('.fab'), loader = $('.loader'), loaderBar = $('.loader-bar span'), loaderYear = $('.loader-year');
  const chapters = $$('.chapter').map((el) => ({ el, from: +el.dataset.from, to: +el.dataset.to, o: -1 }));
  const FILM_END = 0.93;   // до тук вървят кадрите; после е финалът
  const XF = 9;            // кадри преливане между сцените
  let frames = [], offsets = [], counts = [], total = 0, set = 'd', ext = 'webp', srcW = 1176, srcH = 784;
  let target = 0, cur = 0, lastDrawn = -1, dirty = true, filmReady = false, lastFilter = '';

  function sizeCanvas() {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const w = Math.min(Math.round(stage.clientWidth * dpr), 1920), h = Math.round(w * stage.clientHeight / stage.clientWidth);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; dirty = true; }
  }
  function drawCover(img, alpha) {
    const cw = canvas.width, ch = canvas.height, s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * s, h = img.naturalHeight * s;
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  }
  function nearest(sc, i) {
    const arr = frames[sc];
    if (arr[i]) return arr[i];
    for (let d = 1; d < arr.length; d++) { if (arr[i - d]) return arr[i - d]; if (arr[i + d]) return arr[i + d]; }
    return null;
  }
  function drawScene(sc, local, alpha) {
    const n = counts[sc], f = clamp(local, 0, n - 1), i0 = Math.floor(f), frac = f - i0;
    const a = nearest(sc, i0); if (!a) return false;
    drawCover(a, alpha);
    if (frac > 0.02 && i0 + 1 < n) { const b = frames[sc][i0 + 1]; if (b) drawCover(b, alpha * frac); }
    return true;
  }
  function render(t) {
    ctx.globalAlpha = 1; ctx.fillStyle = '#000';
    let drew = false;
    for (let sc = 0; sc < counts.length; sc++) {
      const local = t - offsets[sc];
      if (local < 0 || local > counts[sc] - 1 + 0.001) continue;
      const alpha = sc === 0 ? 1 : clamp(local / XF);
      // smoothstep за по-меко преливане
      drew = drawScene(sc, local, alpha * alpha * (3 - 2 * alpha)) || drew;
    }
    ctx.globalAlpha = 1;
    return drew;
  }

  function filmProgress() {
    const r = film.getBoundingClientRect(), span = r.height - innerHeight;
    return span > 0 ? clamp(-r.top / span) : 0;
  }
  let p = 0;
  function onScroll() {
    p = filmProgress();
    target = clamp(p / FILM_END) * (total - 1);
    const y = scrollY;
    // интро
    intro.style.setProperty('--o', clamp(1 - (p - 0.004) / 0.03).toFixed(3));
    // глави
    chapters.forEach((c) => {
      const o = clamp(Math.min((p - c.from) / 0.022, (c.to - p) / 0.022));
      if (o !== c.o) { c.o = o; c.el.style.setProperty('--o', o.toFixed(3)); }
    });
    // сепия -> цвят в първата сцена
    const s = reduce ? 0 : clamp(1 - (p - 0.02) / 0.12);
    const flt = s > 0.004 ? `sepia(${(s * 0.92).toFixed(3)}) saturate(${(1 - s * 0.3).toFixed(3)}) contrast(${(1 + s * 0.08).toFixed(3)})` : 'none';
    if (flt !== lastFilter) { lastFilter = flt; canvas.style.filter = flt; }
    // лента и година
    const inFilm = p > 0.03 && p < FILM_END - 0.01;
    rail.style.setProperty('--o', inFilm ? 1 : 0);
    rail.style.transition = 'opacity .6s';
    rail.style.opacity = inFilm ? 1 : 0;
    railFill.style.setProperty('--p', clamp(p / FILM_END).toFixed(4));
    railYear.textContent = 1926 + Math.round(100 * clamp((p - 0.02) / (FILM_END - 0.04)));
    // финал
    const e = clamp((p - (FILM_END - 0.02)) / 0.045);
    endCard.style.setProperty('--o', e.toFixed(3));
    endCard.classList.toggle('live', e > 0.6);
    const dark = clamp((p - (FILM_END - 0.03)) / 0.05) * 0.8 + clamp((p - 0.985) / 0.015) * 0.2;
    stage.style.setProperty('--dark', dark.toFixed(3));
    // навигация
    const past = film.getBoundingClientRect().bottom < innerHeight * 0.6;
    nav.classList.toggle('hide', !past && p > 0.03);
    nav.classList.toggle('solid', past);
    fab.style.setProperty('--s', past ? 1 : 0);
    // паралакс на снимките
    if (!reduce) $$('.ph.in img').forEach((img) => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > innerHeight + 100) return;
      const rel = clamp((r.top + r.height / 2 - innerHeight / 2) / innerHeight, -1, 1);
      img.style.setProperty('--py', (-7.6 - rel * 7).toFixed(2) + '%');
    });
    // линията във фермата
    const flow = $('.farm-flow');
    if (flow) { const r = flow.getBoundingClientRect(); flow.style.setProperty('--draw', clamp((innerHeight * 0.75 - r.top) / r.height).toFixed(4)); }
    scrollVel = y - lastY; lastY = y;
  }
  let lastY = scrollY, scrollVel = 0;

  function tick() {
    if (filmReady) {
      const d = target - cur;
      cur = Math.abs(d) < 0.01 ? target : cur + d * 0.14;
      if (dirty || Math.abs(cur - lastDrawn) > 0.008) {
        if (render(cur)) { lastDrawn = cur; dirty = false; }
      }
    }
    requestAnimationFrame(tick);
  }

  function hideLoader() {
    if (loader.classList.contains('done')) return;
    loader.classList.add('done'); document.body.classList.add('ready');
  }

  async function startFilm() {
    sizeCanvas();
    let manifest;
    try { manifest = await (await fetch('assets/film/manifest.json')).json(); } catch { hideLoader(); return; }
    set = matchMedia('(max-width: 760px)').matches ? 'm' : 'd';
    ({ ext, w: srcW, h: srcH, scenes: counts } = manifest[set]);
    frames = counts.map((n) => new Array(n).fill(null));
    let off = 0; offsets = counts.map((n, i) => { const o = off; off += n - (i < counts.length - 1 ? XF : 0); return o; });
    total = off;
    const url = (sc, i) => `assets/film/${set}/s${sc + 1}/${String(i + 1).padStart(4, '0')}.${ext}`;
    const load = (sc, i) => new Promise((res) => {
      if (frames[sc][i]) return res();
      const img = new Image(); img.decoding = 'async';
      img.onload = () => { const ok = () => { frames[sc][i] = img; dirty = true; res(); }; img.decode ? img.decode().then(ok, ok) : ok(); };
      img.onerror = () => res();
      img.src = url(sc, i);
    });

    // 1) първият кадър веднага; 2) груба мрежа от всички сцени; 3) допълване
    await load(0, 0);
    filmReady = true; onScroll(); cur = target; dirty = true;
    if (reduce) { hideLoader(); return; }

    const coarse = [], fill = [];
    counts.forEach((n, sc) => { for (let i = 0; i < n; i++) (i % 6 === 0 || i === n - 1 ? coarse : fill).push([sc, i]); });
    const nearFirst = (list) => list.sort((a, b) => Math.abs(offsets[a[0]] + a[1] - cur) - Math.abs(offsets[b[0]] + b[1] - cur));
    let done = 0;
    const firstBatch = coarse.filter(([sc]) => sc <= 1).length;
    const run = async (queue, workers, onEach) => {
      await Promise.all(Array.from({ length: workers }, async () => {
        while (queue.length) { nearFirst(queue); const [sc, i] = queue.shift(); await load(sc, i); onEach && onEach(); }
      }));
    };
    const tLoad = setTimeout(hideLoader, 7000);
    await run(coarse, 6, () => {
      done++;
      const k = clamp(done / firstBatch);
      loaderBar.style.width = (k * 100).toFixed(0) + '%';
      loaderYear.textContent = 1926 + Math.round(100 * k);
      if (done >= firstBatch) { clearTimeout(tLoad); hideLoader(); }
    });
    hideLoader();
    await run(fill, 4);
  }

  /* ------------------------------------------------------------------
     Липови листа
  ------------------------------------------------------------------ */
  function startLeaves() {
    if (reduce) return;
    const c = $('.leaves'), x = c.getContext('2d');
    let W, H, dpr;
    const size = () => { dpr = Math.min(devicePixelRatio || 1, 1.5); W = c.width = innerWidth * dpr; H = c.height = innerHeight * dpr; };
    size(); addEventListener('resize', size);
    const N = innerWidth < 760 ? 5 : 10;
    const mk = (top) => ({ x: Math.random() * W, y: top ? -40 * dpr : Math.random() * H, s: (10 + Math.random() * 16) * dpr, vy: (0.25 + Math.random() * 0.5) * dpr, ph: Math.random() * 6.28, sw: 0.4 + Math.random() * 0.9, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.02, a: 0.14 + Math.random() * 0.26, g: Math.random() < 0.55 });
    const L = Array.from({ length: N }, () => mk(false));
    const leaf = (s) => { x.beginPath(); x.moveTo(0, -s); x.bezierCurveTo(s * 0.95, -s * 0.75, s * 1.05, s * 0.25, 0, s); x.bezierCurveTo(-s * 1.05, s * 0.25, -s * 0.95, -s * 0.75, 0, -s); x.fill(); x.beginPath(); x.moveTo(0, -s * 0.7); x.lineTo(0, s * 1.25); x.stroke(); };
    let t = 0;
    (function loop() {
      requestAnimationFrame(loop);
      if (document.hidden) return;
      t += 0.016; x.clearRect(0, 0, W, H);
      const boost = clamp(Math.abs(scrollVel) / 40, 0, 2.5);
      for (const l of L) {
        l.y += l.vy * (1 + boost * 1.6); l.x += Math.sin(t * l.sw + l.ph) * 0.6 * dpr; l.r += l.vr * (1 + boost);
        if (l.y > H + 50 * dpr) Object.assign(l, mk(true));
        x.save(); x.translate(l.x, l.y); x.rotate(l.r); x.scale(1, 0.55 + 0.45 * Math.cos(t * l.sw * 1.3 + l.ph));
        x.globalAlpha = l.a; x.fillStyle = l.g ? '#d1a54f' : '#8fa15a'; x.strokeStyle = 'rgba(30,20,10,.5)'; x.lineWidth = dpr;
        leaf(l.s); x.restore();
      }
      scrollVel *= 0.9;
    })();
  }

  /* ------------------------------------------------------------------ */
  renderTabs(); renderMenu(); openNow(); setInterval(openNow, 60000);
  if (lang !== 'bg') setLang(lang);
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { sizeCanvas(); onScroll(); });
  onScroll(); requestAnimationFrame(tick);
  startFilm(); startLeaves();
})();
