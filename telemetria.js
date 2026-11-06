/* FAROL — avisos anónimos de progresso para o painel do Nico (zagora.space/admin/farol).
   - Cada jogador é só um código aleatório guardado neste navegador. Nada de nomes, e-mails ou IP.
   - Os avisos juntam-se e vão de vez em quando; se o servidor falhar, o jogo nem dá por isso.
   - Abre o jogo uma vez com ?eu=1 para este navegador deixar de contar (?eu=0 volta a contar). */
(() => {
  const URL_EV = 'https://zagora.space/farol/evento.php';
  const ls = {
    ler(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    por(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} }
  };
  const qs = new URLSearchParams(location.search);
  if (qs.get('eu') === '1') ls.por('farol_eu', '1');
  if (qs.get('eu') === '0') ls.por('farol_eu', null);
  const desligado = ls.ler('farol_eu') === '1';

  const aleatorio = n => Array.from(crypto.getRandomValues(new Uint8Array(n)), b => (b % 36).toString(36)).join('');
  let jogador = ls.ler('farol_jogador');
  if (!/^[a-z0-9]{8,24}$/.test(jogador || '')) { jogador = aleatorio(14); ls.por('farol_jogador', jogador); }
  const sessao = aleatorio(10);
  const disp = matchMedia('(max-width: 820px), (pointer: coarse)').matches ? 'tel' : 'pc';
  const ref = (qs.get('r') || '').toLowerCase().slice(0, 20);

  let fila = [];
  let contexto = () => ({});
  let inicioPasso = Date.now();

  function enviar() {
    if (!fila.length || desligado) { fila = []; return; }
    const corpo = JSON.stringify({ j: jogador, s: sessao, disp, r: ref, agora: Date.now(), e: fila.splice(0, 40) });
    try {
      const ok = navigator.sendBeacon && navigator.sendBeacon(URL_EV, new Blob([corpo], { type: 'text/plain' }));
      if (!ok) fetch(URL_EV, { method: 'POST', body: corpo, keepalive: true, mode: 'no-cors' }).catch(() => {});
    } catch (e) {}
    if (fila.length) enviar();
  }

  function ev(t, extra = {}) {
    if (desligado) return;
    try {
      const c = contexto() || {};
      fila.push({ t, m: c.m || 0, i: c.i ?? -1, f: c.f || '', ts: Date.now(), ...extra });
      if (fila.length >= 20) enviar();
    } catch (e) {}
  }

  setInterval(enviar, 5000);
  addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') enviar(); });
  addEventListener('pagehide', enviar);

  window.FarolStats = {
    ev,
    // o jogo diz em que missão e passo está
    contexto(fn) { contexto = fn; },
    // um passo acabou: guarda quanto tempo levou e recomeça a contar
    passo(t, m, i, f) {
      ev(t, { m, i, f, ms: Date.now() - inicioPasso });
      inicioPasso = Date.now();
    },
    recomecarRelogio() { inicioPasso = Date.now(); }
  };
})();
