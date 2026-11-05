/* FAROL — ambiente de trabalho simulado: ícones, janelas e barra de tarefas */
window.WM = (() => {
'use strict';

const ICONES = {
  notas: '<svg viewBox="0 0 48 48"><path d="M10 4h22l8 8v32H10z" fill="#fff6c4"/><path d="M32 4v8h8" fill="#e6d88a"/><g stroke="#b9a95a" stroke-width="1.6"><path d="M15 18h20M15 23h20M15 28h20M15 33h14"/></g><path d="M36 26l6-6 3 3-6 6-4 1z" fill="#e0703a"/></svg>',
  terminal: '<svg viewBox="0 0 48 48"><rect x="4" y="7" width="40" height="34" rx="4" fill="#2b2f36"/><rect x="7" y="13" width="34" height="25" rx="1.5" fill="#0b0f0c"/><circle cx="9" cy="10" r="1.3" fill="#ff5f56"/><circle cx="13" cy="10" r="1.3" fill="#ffbd2e"/><path d="M12 19l6 5-6 5" stroke="#39ff88" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 31h10" stroke="#39ff88" stroke-width="2.6" stroke-linecap="round"/></svg>',
  python: '<svg viewBox="0 0 48 48"><path d="M23.6 5c-9 0-8.4 3.9-8.4 3.9v4h8.6v1.2H11.9S6 13.5 6 22.6s5.1 8.8 5.1 8.8h3.1v-4.3s-.2-5.1 5-5.1h8.6s4.9.1 4.9-4.7V9.4S33.4 5 23.6 5zm-4.8 2.7a1.6 1.6 0 110 3.2 1.6 1.6 0 010-3.2z" fill="#3b78b0"/><path d="M24.4 43c9 0 8.4-3.9 8.4-3.9v-4h-8.6v-1.2h11.9s5.9.7 5.9-8.5-5.1-8.8-5.1-8.8h-3.1v4.3s.2 5.1-5 5.1h-8.6s-4.9-.1-4.9 4.7v7.9S14.6 43 24.4 43zm4.8-2.7a1.6 1.6 0 110-3.2 1.6 1.6 0 010 3.2z" fill="#f2c434"/></svg>',
  pasta: '<svg viewBox="0 0 48 48"><path d="M4 12a3 3 0 013-3h11l4 4h19a3 3 0 013 3v22a3 3 0 01-3 3H7a3 3 0 01-3-3z" fill="#c98a2e"/><path d="M4 18h40v20a3 3 0 01-3 3H7a3 3 0 01-3-3z" fill="#e9a945"/></svg>',
  pastaOculta: '<svg viewBox="0 0 48 48" opacity=".6"><path d="M4 12a3 3 0 013-3h11l4 4h19a3 3 0 013 3v22a3 3 0 01-3 3H7a3 3 0 01-3-3z" fill="#8a7a5e"/><path d="M4 18h40v20a3 3 0 01-3 3H7a3 3 0 01-3-3z" fill="#b7a27a"/><circle cx="24" cy="29" r="5" fill="none" stroke="#3b3326" stroke-width="2"/><circle cx="24" cy="29" r="2" fill="#3b3326"/></svg>',
  casa: '<svg viewBox="0 0 48 48"><path d="M4 12a3 3 0 013-3h11l4 4h19a3 3 0 013 3v22a3 3 0 01-3 3H7a3 3 0 01-3-3z" fill="#c98a2e"/><path d="M4 18h40v20a3 3 0 01-3 3H7a3 3 0 01-3-3z" fill="#e9a945"/><path d="M24 21l-8 7h3v7h10v-7h3z" fill="#fff4dc"/></svg>',
  texto: '<svg viewBox="0 0 48 48"><path d="M10 4h20l8 8v32H10z" fill="#f4f4f0"/><path d="M30 4v8h8" fill="#cfcfc8"/><g stroke="#9aa0a6" stroke-width="1.6"><path d="M15 18h18M15 23h18M15 28h18M15 33h12"/></g></svg>',
  imagem: '<svg viewBox="0 0 48 48"><rect x="5" y="8" width="38" height="32" rx="3" fill="#f4f4f0"/><rect x="8" y="11" width="32" height="24" fill="#6fa8dc"/><path d="M8 35l10-12 7 8 5-5 10 9z" fill="#3d7a3d"/><circle cx="32" cy="17" r="3" fill="#ffe08a"/></svg>',
  codigo: '<svg viewBox="0 0 48 48"><path d="M10 4h20l8 8v32H10z" fill="#f4f4f0"/><path d="M30 4v8h8" fill="#cfcfc8"/><path d="M19 22l-5 5 5 5M29 22l5 5-5 5" stroke="#3b78b0" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>',
  correio: '<svg viewBox="0 0 48 48"><rect x="4" y="10" width="40" height="28" rx="3" fill="#eef1f5"/><path d="M5 12l19 14 19-14" stroke="#5b7aa6" stroke-width="2.4" fill="none"/></svg>',
  lixo: '<svg viewBox="0 0 48 48"><path d="M12 14h24l-2.5 28h-19z" fill="#a9b2bc"/><rect x="9" y="9" width="30" height="5" rx="1.5" fill="#7d8790"/><rect x="20" y="5" width="8" height="4" rx="1" fill="#7d8790"/><path d="M19 19v18M24 19v18M29 19v18" stroke="#7d8790" stroke-width="1.8"/></svg>'
};

const APPS = {
  notas:     { nome: 'Notas',         ico: 'notas' },
  terminal:  { nome: 'Terminal',      ico: 'terminal' },
  python:    { nome: 'Python',        ico: 'python' },
  ficheiros: { nome: 'Pasta pessoal', ico: 'casa' },
  correio:   { nome: 'Correio',       ico: 'correio' },
  visor:     { nome: 'Visualizador',  ico: 'texto', escondido: true }
};

const mobil = () => matchMedia('(max-width:820px)').matches;
const win = id => document.getElementById('win-' + id);
let z = 10;
const novos = new Set();
const ouvintes = [];
const evt = (tipo, id) => ouvintes.forEach(f => f(tipo, id));

function areaUtil() {
  const a = document.getElementById('ambiente');
  return { w: a.clientWidth, h: a.clientHeight };
}

// posições iniciais pensadas para caber tudo sem tapar os ícones
function posicionar(w, id) {
  const { w: W, h: H } = areaUtil();
  const m = 14, esq = 104;
  const notasW = Math.round(Math.min(410, Math.max(320, (W - esq) * 0.34)));
  const dirX = esq + notasW + m;
  const dirW = W - dirX - m;
  const meio = Math.round((H - 3 * m) * 0.45);
  const L = {
    notas:     [esq, m, notasW, H - 2 * m],
    terminal:  [dirX, m, dirW - 28, H - 2 * m - 28],   // Terminal e Python ocupam a coluna, em cascata
    python:    [dirX + 28, m + 28, dirW - 28, H - 2 * m - 28],
    ficheiros: [esq + 60, 60, Math.min(660, W - esq - 80), Math.min(430, H - 100)],
    visor:     [esq + 120, 90, Math.min(620, W - esq - 140), Math.min(440, H - 120)],
    correio:   [esq + 90, 70, Math.min(760, W - esq - 110), Math.min(470, H - 100)]
  }[id];
  const [x, y, ww, hh] = L;
  Object.assign(w.style, { left: x + 'px', top: y + 'px', width: Math.max(300, ww) + 'px', height: Math.max(220, hh) + 'px' });
  w.dataset.posto = '1';
}

function abrir(id, { semFoco = false } = {}) {
  const w = win(id);
  if (w.hidden) { w.hidden = false; if (!w.dataset.posto) posicionar(w, id); evt('abrir', id); }
  w.classList.remove('min');
  if (!semFoco || mobil()) focar(id); else render();
}
function fechar(id) { win(id).hidden = true; win(id).classList.remove('ativa'); render(); focarTopo(); evt('fechar', id); }
function minimizar(id) { win(id).classList.add('min'); win(id).classList.remove('ativa'); render(); focarTopo(); }
function focar(id) {
  document.querySelectorAll('.janela.ativa').forEach(x => x.classList.remove('ativa'));
  const w = win(id);
  w.style.zIndex = ++z;
  w.classList.add('ativa');
  novos.delete(id);
  render();
  evt('focar', id);
}
function focarTopo() {
  const abertas = [...document.querySelectorAll('.janela:not([hidden]):not(.min)')];
  if (!abertas.length) return render();
  abertas.sort((a, b) => (+b.style.zIndex || 0) - (+a.style.zIndex || 0));
  focar(abertas[0].id.slice(4));
}
const ativa = () => { const w = document.querySelector('.janela.ativa'); return w ? w.id.slice(4) : null; };
const aberta = id => !win(id).hidden && !win(id).classList.contains('min');
function marcarNovo(id) { if (ativa() !== id) { novos.add(id); render(); } }

/* ícones do ambiente de trabalho */
function desenharIcones(extra) {
  const nav = document.getElementById('icones');
  const lista = Object.entries(APPS).filter(([, a]) => !a.escondido).map(([id, a]) => [id, a.nome, a.ico]).concat(extra || []);
  nav.innerHTML = lista.map(([id, nome, ico]) =>
    `<button class="icone" data-app="${id}"><span class="ico">${ICONES[ico]}</span><span class="nome">${nome}</span><i class="ponto"></i></button>`).join('');
}

/* barra de tarefas */
function render() {
  const lista = document.getElementById('tarefasLista');
  const ids = mobil()
    ? ['notas', 'terminal', 'python', 'correio']
    : Object.keys(APPS).filter(id => !win(id).hidden);
  const at = ativa();
  lista.innerHTML = ids.map(id => {
    const a = APPS[id];
    const nome = id === 'visor' ? (document.getElementById('visorTitulo').textContent.split(' — ')[0]) : a.nome;
    return `<button class="tb-app${id === at ? ' ativa' : ''}${!win(id).hidden && win(id).classList.contains('min') ? ' min' : ''}${novos.has(id) ? ' novo' : ''}" data-app="${id}" title="${nome}"><span class="ico">${ICONES[a.ico]}</span><span class="nome">${nome}</span></button>`;
  }).join('');
  document.querySelectorAll('#icones .icone').forEach(b => b.classList.toggle('novo', novos.has(b.dataset.app)));
  document.body.classList.toggle('sem-janelas', !document.querySelector('.janela:not([hidden]):not(.min)'));
}

document.getElementById('tarefasLista').addEventListener('click', e => {
  const b = e.target.closest('.tb-app'); if (!b) return;
  const id = b.dataset.app;
  if (!mobil() && ativa() === id) minimizar(id); else abrir(id);
});

/* botões e arrastar */
document.querySelectorAll('.janela').forEach(w => {
  const id = w.id.slice(4);
  w.querySelector('.jt-ico').innerHTML = ICONES[APPS[id].ico];
  w.addEventListener('pointerdown', () => { if (ativa() !== id) focar(id); }, true);
  w.querySelector('.jt-bts').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const a = b.dataset.w;
    if (a === 'fechar') fechar(id);
    else if (a === 'min') minimizar(id);
    else if (a === 'max') w.classList.toggle('max');
  });
  const cab = w.querySelector('.jt');
  cab.addEventListener('dblclick', e => { if (!e.target.closest('button')) w.classList.toggle('max'); });
  cab.addEventListener('pointerdown', e => {
    if (e.target.closest('button') || mobil() || w.classList.contains('max') || e.button !== 0) return;
    e.preventDefault();
    const { w: W, h: H } = areaUtil();
    const x0 = e.clientX - w.offsetLeft, y0 = e.clientY - w.offsetTop;
    cab.setPointerCapture(e.pointerId);
    const mover = ev => {
      const x = Math.min(W - 80, Math.max(80 - w.offsetWidth, ev.clientX - x0));
      const y = Math.min(H - 30, Math.max(0, ev.clientY - y0));
      w.style.left = x + 'px'; w.style.top = y + 'px';
    };
    const soltar = () => { cab.removeEventListener('pointermove', mover); cab.removeEventListener('pointerup', soltar); };
    cab.addEventListener('pointermove', mover);
    cab.addEventListener('pointerup', soltar);
  });
});

/* menu Aplicações */
const menu = document.getElementById('menu');
document.getElementById('menuBtn').addEventListener('click', e => {
  e.stopPropagation();
  document.getElementById('menuApps').innerHTML = [...Object.entries(APPS).filter(([, a]) => !a.escondido).map(([id, a]) => [id, a.nome, a.ico]), ['lixo', 'Lixo', 'lixo']]
    .map(([id, n, ico]) => `<button data-app="${id}"><span class="ico">${ICONES[ico]}</span>${n}</button>`).join('');
  menu.hidden = !menu.hidden;
});
document.addEventListener('click', e => { if (!menu.hidden && !e.target.closest('#menu')) menu.hidden = true; });
menu.addEventListener('click', e => { if (e.target.closest('button,a')) menu.hidden = true; });

window.addEventListener('resize', () => {
  // se a janela do navegador encolher, trazer as janelas para dentro
  const { w: W, h: H } = areaUtil();
  document.querySelectorAll('.janela').forEach(w => {
    if (w.offsetLeft > W - 80) w.style.left = Math.max(0, W - w.offsetWidth) + 'px';
    if (w.offsetTop > H - 30) w.style.top = Math.max(0, H - w.offsetHeight) + 'px';
  });
  render();
});

/* relógio da barra de tarefas (o tempo do jogo começa a 20/03/2009 23:58) */
const DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
let base = null;
function relogio(inicio) { base = inicio; tique(); }
function tique() {
  const t0 = new Date(2009, 2, 20, 23, 58, 0).getTime();
  const d = new Date(t0 + (base ? Date.now() - base : 0));
  document.getElementById('relogio').textContent = `${DIAS[d.getDay()]} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
setInterval(tique, 10000);

return { abrir, fechar, focar, minimizar, ativa, aberta, marcarNovo, render, desenharIcones, relogio, mobil, on: f => ouvintes.push(f), ICONES, reposicionar: () => document.querySelectorAll('.janela').forEach(w => delete w.dataset.posto) };
})();
