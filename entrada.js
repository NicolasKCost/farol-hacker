/* Ecrã de entrada: a história contada em cinco ilustrações animadas. */
(() => {
  const svg = document.getElementById('rabSvg');
  if (!svg) return;
  const ecra = document.getElementById('ecraIntro');
  const leg = document.getElementById('rabLeg');
  const pontos = document.getElementById('rabPontos');
  const cenas = [...svg.querySelectorAll('.cena')];
  const DURACAO = 6500;   // tempo de cada desenho, em ms

  // as peças de cada cena entram uma a seguir à outra
  cenas.forEach(c => {
    [...c.children].forEach((el, k) => el.style.setProperty('--d', (k * 0.12).toFixed(2) + 's'));
  });

  pontos.innerHTML = cenas.map((_, k) => `<button type="button" aria-label="Desenho ${k + 1}"></button>`).join('');
  pontos.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (b) mostrar([...pontos.children].indexOf(b));
  });

  let atual = 0, temporizador = null;
  function mostrar(n) {
    atual = (n + cenas.length) % cenas.length;
    cenas.forEach(c => c.classList.remove('ativa'));
    void svg.getBoundingClientRect();   // recomeçar as animações
    cenas[atual].classList.add('ativa');
    leg.innerHTML = cenas[atual].dataset.leg;
    [...pontos.children].forEach((b, k) => b.classList.toggle('on', k === atual));
    clearTimeout(temporizador);
    temporizador = setTimeout(() => { if (!ecra.hidden) mostrar(atual + 1); }, DURACAO);
  }
  mostrar(0);
})();
