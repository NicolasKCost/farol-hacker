/* FAROL — motor do jogo (terminal falso + Python via Pyodide + progresso) */
(() => {
'use strict';

const MISSOES = window.MISSOES.slice().sort((a, b) => a.numero - b.numero);
const lsLer = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const lsPor = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
const concluida = n => { try { return !!(JSON.parse(lsLer('farol_m' + n)) || {}).fim; } catch (e) { return false; } };
const pedida = +new URLSearchParams(location.search).get('m') || +lsLer('farol_missao') || 1;
const M = MISSOES.find(x => x.numero === pedida) || MISSOES[0];
const SEGUINTE = MISSOES.find(x => x.numero === M.numero + 1);
lsPor('farol_missao', M.numero);
const CHAVE = 'farol_' + M.id;
const PYODIDE_VER = '0.26.4';
const PYODIDE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VER}/full/`;
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- estado e gravação ---------- */
const estadoNovo = () => ({ factos: {}, cwd: M.home, codigo: null, linhas: [], hist: [], lidos: {}, pendente: null, extra: {}, inicio: null, fim: null, comecou: false });
let E = estadoNovo();
function carregar() {
  try { const s = JSON.parse(localStorage.getItem(CHAVE)); if (s && typeof s === 'object') E = Object.assign(estadoNovo(), s); } catch (e) {}
}
let tGravar = null;
function gravar() {
  clearTimeout(tGravar);
  tGravar = setTimeout(() => {
    try { localStorage.setItem(CHAVE, JSON.stringify(E)); } catch (e) {}
  }, 150);
}

/* ---------- sistema de ficheiros virtual ---------- */
const FS = JSON.parse(JSON.stringify(M.fs));
const ehDir = n => n !== null && typeof n === 'object';
function normalizar(caminho, base) {
  if (!caminho) return base;
  if (caminho === '~' || caminho.startsWith('~/')) caminho = M.home + caminho.slice(1);
  const partes = (caminho.startsWith('/') ? [] : base.split('/').filter(Boolean));
  for (const p of caminho.split('/')) {
    if (!p || p === '.') continue;
    if (p === '..') partes.pop(); else partes.push(p);
  }
  return '/' + partes.join('/');
}
function obter(abs) {
  let n = FS;
  for (const p of abs.split('/').filter(Boolean)) {
    if (!ehDir(n) || !(p in n)) return undefined;
    n = n[p];
  }
  return n;
}
const curto = abs => abs === M.home ? '~' : abs.startsWith(M.home + '/') ? '~' + abs.slice(M.home.length) : abs;

/* ---------- terminal ---------- */
const saida = $('#saida'), term = $('#term'), cmd = $('#cmd'), promptEl = $('#prompt');
let ssh = null;            // fluxo de ssh em curso: {passo:'senha', tent}
let ocupado = false;
let histPos = -1;

function linha(txt, cls = '', html = false, guardar = true) {
  const d = document.createElement('div');
  if (cls) d.className = cls;
  if (html) d.innerHTML = txt; else d.textContent = txt;
  saida.appendChild(d);
  if (guardar) {
    E.linhas.push([html ? txt : esc(txt), cls]);
    if (E.linhas.length > 400) E.linhas.splice(0, E.linhas.length - 400);
    gravar();
  }
  rolar();
}
const rolar = () => { term.scrollTop = term.scrollHeight; };
const promptTxt = () => `${M.user}@${M.host}:${curto(E.cwd)}$`;
function atualizarPrompt() {
  promptEl.textContent = ssh ? 'palavra-passe:' : promptTxt();
  cmd.type = ssh ? 'password' : 'text';
  $('#tituloTerm').textContent = `${M.user}@${M.host}: ${curto(E.cwd)}`;
}
const espera = ms => new Promise(r => setTimeout(r, ms));

const AJUDA = [
  ['help', 'mostra esta ajuda'],
  ['ls', 'lista ficheiros e pastas (ls -a mostra os ocultos, ls -l mostra detalhes)'],
  ['cd <pasta>', 'entra numa pasta (cd .. sobe, cd sozinho volta a casa)'],
  ['cat <ficheiro>', 'mostra o conteúdo de um ficheiro'],
  ['head <ficheiro>', 'mostra as primeiras 10 linhas (tail: as últimas)'],
  ['wc -l <ficheiro>', 'conta as linhas de um ficheiro'],
  ['grep <palavra> <f>', 'mostra só as linhas que têm a palavra'],
  ['pwd', 'mostra em que pasta estás'],
  ['whoami', 'mostra com que utilizador estás'],
  ['python', 'abre o editor de Python'],
  ['ssh <user>@<ip>', 'liga-te a outro computador'],
  ['history', 'mostra os comandos que já escreveste'],
  ['clear', 'limpa o ecrã']
];

const comandos = {
  help() {
    linha('Comandos disponíveis:', 'info');
    for (const [c, d] of AJUDA) linha(`  <span class="ok">${esc(c.padEnd(16))}</span> ${esc(d)}`, '', true);
    linha('Dica: carrega em Tab para completar nomes e ↑ para repetir comandos.', 'dim');
    facto('help');
  },
  ls(args) {
    const flags = args.filter(a => a.startsWith('-')).join('');
    const alvos = args.filter(a => !a.startsWith('-'));
    const todos = flags.includes('a'), longo = flags.includes('l');
    const abs = normalizar(alvos[0] || '.', E.cwd);
    const n = obter(abs);
    if (n === undefined) return linha(`ls: não é possível aceder a '${alvos[0]}': Ficheiro ou diretoria inexistente`, 'erro');
    if (!ehDir(n)) return linha(alvos[0]);
    let nomes = Object.keys(n).sort((a, b) => a.replace(/^\./, '').localeCompare(b.replace(/^\./, ''), 'pt', { sensitivity: 'base' }));
    if (todos) nomes = ['.', '..', ...nomes]; else nomes = nomes.filter(x => !x.startsWith('.'));
    const fmt = x => {
      const filho = x === '.' || x === '..' ? {} : n[x];
      const d = ehDir(filho);
      const cls = x.startsWith('.') && x !== '.' && x !== '..' ? (d ? 'dir oculto' : 'oculto') : (d ? 'dir' : '');
      return `<span class="${cls}">${esc(x)}${d && x !== '.' && x !== '..' ? '/' : ''}</span>`;
    };
    if (!nomes.length) { /* pasta vazia */ }
    else if (longo) {
      for (const x of nomes) {
        const filho = x === '.' || x === '..' ? {} : n[x];
        const d = ehDir(filho);
        const tam = d ? 4096 : (filho === '\u0000BINARIO' ? 284113 : new Blob([filho]).size);
        linha(`${d ? 'drwxr-xr-x' : '-rw-r--r--'} marta marta ${String(tam).padStart(6)} mar 20  2009 ${fmt(x)}`, '', true);
      }
    } else linha(nomes.map(fmt).join('   '), '', true);
    facto('ls');
    if (todos && abs === M.home) facto('viuOculto');
  },
  cd(args) {
    const alvo = args[0];
    const abs = normalizar(alvo || '~', E.cwd);
    const n = obter(abs);
    if (n === undefined) return linha(`cd: ${alvo}: Ficheiro ou diretoria inexistente`, 'erro');
    if (!ehDir(n)) return linha(`cd: ${alvo}: Não é uma diretoria`, 'erro');
    E.cwd = abs; gravar(); atualizarPrompt();
  },
  cat(args) {
    if (!args.length) return linha('cat: falta o nome do ficheiro. Exemplo: cat LEIA-ME.txt', 'erro');
    for (const a of args) {
      const abs = normalizar(a, E.cwd);
      const n = obter(abs);
      if (n === undefined) {
        const parecido = sugerir(a);
        linha(`cat: ${a}: Ficheiro ou diretoria inexistente`, 'erro');
        if (parecido) linha(`Querias dizer "${parecido}"? Atenção às maiúsculas.`, 'dim');
        continue;
      }
      if (ehDir(n)) { linha(`cat: ${a}: É uma diretoria (usa cd ${a} para entrar)`, 'erro'); continue; }
      if (n === '\u0000BINARIO') { linha('ÿØÿà\u0000\u0010JFIF\u0000\u0001\u0001\u0000H\u0000H\u0000\u0000ÿÛ\u0000C\u0000\u0008\u0006\u0006\u0007\u0006\u0005\u0008…', 'dim'); linha('(isto é uma imagem, não texto — o cat só serve para texto)', 'warn'); continue; }
      const ls = n.replace(/\n$/, '').split('\n');
      if (ls.length > 250) linha(`(… ${ls.length - 200} linhas acima não mostradas. O ficheiro é grande: experimenta head, tail ou grep.)`, 'warn');
      for (const l of ls.length > 250 ? ls.slice(-200) : ls) linha(l);
      verCmd({ nome: 'cat', abs, linhas: ls });
    }
  },
  pwd() { linha(E.cwd); },
  whoami() { linha(M.user); },
  hostname() { linha(M.host); },
  date() { linha(M.dataTxt || 'sex 20 mar 2009 23:58:12 WET'); },
  head(args) { mostrarParte(args, 'head'); },
  tail(args) { mostrarParte(args, 'tail'); },
  wc(args) {
    const f = lerTexto(args.filter(a => !a.startsWith('-'))[0], 'wc'); if (!f) return;
    const ls = f.txt.replace(/\n$/, '').split('\n');
    if (args.includes('-l')) linha(`${ls.length} ${f.nome}`);
    else linha(`${ls.length} ${f.txt.split(/\s+/).filter(Boolean).length} ${new Blob([f.txt]).size} ${f.nome}`);
    verCmd({ nome: 'wc', abs: f.abs, n: ls.length });
  },
  grep(args) {
    const flags = args.filter(a => /^-[a-z]+$/.test(a)).join('');
    const resto = args.filter(a => !/^-[a-z]+$/.test(a));
    const padrao = resto[0];
    if (!padrao || !resto[1]) return linha('Uso: grep <palavra> <ficheiro>   (exemplo: grep Failed auth.log)', 'warn');
    const f = lerTexto(resto[1], 'grep'); if (!f) return;
    const i = flags.includes('i'), v = flags.includes('v');
    const tem = l => (i ? l.toLowerCase().includes(padrao.toLowerCase()) : l.includes(padrao)) !== v;
    const achadas = f.txt.replace(/\n$/, '').split('\n').filter(tem);
    if (flags.includes('c')) linha(String(achadas.length));
    else if (!achadas.length) linha(`(nenhuma linha com "${padrao}". Atenção: o grep distingue maiúsculas de minúsculas.)`, 'dim');
    else {
      const re = new RegExp('(' + padrao.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', i ? 'gi' : 'g');
      const mostrar = achadas.length > 80 ? achadas.slice(0, 60) : achadas;
      for (const l of mostrar) linha(v ? esc(l) : esc(l).replace(re, '<span class="grep-m">$1</span>'), '', true);
      if (achadas.length > 80) linha(`(… e mais ${achadas.length - 60} linhas. Total: ${achadas.length}. Dica: grep -c ${padrao.includes(' ') ? '"' + padrao + '"' : padrao} ${resto[1]} só conta.)`, 'warn');
    }
    verCmd({ nome: 'grep', abs: f.abs, padrao, flags, linhas: achadas });
  },
  uname(args) { linha(args.includes('-a') ? 'Linux sotao 2.6.28-11-generic #42 i686 GNU/Linux' : 'Linux'); },
  echo(args) { linha(args.join(' ')); },
  clear() { saida.innerHTML = ''; E.linhas = []; gravar(); },
  history() { E.hist.forEach((h, i) => linha(`${String(i + 1).padStart(4)}  ${h}`)); },
  python() { linha('A abrir o editor de Python...', 'info'); mostrarAba('python'); $('#codigo').focus(); prepararPython(); },
  base64() { linha('bash: base64: comando não encontrado', 'erro'); linha('Alguém desinstalou isto de propósito. Talvez o Python ajude...', 'dim'); },
  sudo() { linha('[sudo] palavra-passe para marta: ', 'dim'); linha('marta não está no ficheiro sudoers. Este incidente será reportado.', 'erro'); },
  rm() { linha('Melhor não apagar nada: isto são provas.', 'warn'); },
  nano() { linha('Este computador não tem editores de texto. Usa o editor de Python.', 'warn'); },
  exit() { linha('Não há para onde sair. Estás preso neste sótão até descobrires a verdade.', 'warn'); },
  ping(args) { comandos.ssh(args, true); },
  ssh(args, ehPing) {
    if (ehPing) {
      const ip = args[0];
      if (M.servidor && ip === M.servidor.ip) { linha(`64 bytes de ${ip}: icmp_seq=1 ttl=64 tempo=0.42 ms`); linha('O servidor está vivo.', 'dim'); }
      else linha(`ping: ${ip || '?'}: sem resposta`, 'erro');
      return;
    }
    const alvo = args.find(a => !a.startsWith('-'));
    if (!alvo) return linha('Uso: ssh utilizador@endereço   (exemplo: ssh marta@10.0.0.7)', 'warn');
    const [u, ip] = alvo.includes('@') ? alvo.split('@') : [M.user, alvo];
    if (!M.servidor) return linha(`ssh: ligar a ${ip} porta 22: ligação recusada`, 'erro');
    if (ip !== M.servidor.ip && ip !== 'farol') return linha(`ssh: ligar ao servidor ${ip} porta 22: tempo esgotado`, 'erro');
    if (u !== M.servidor.user) return linha(`${u}@${ip}: Permission denied (publickey,password).`, 'erro');
    linha(`A ligar a ${M.servidor.ip}...`, 'dim');
    ssh = { tent: 0 }; atualizarPrompt();
  }
};
comandos.python3 = comandos.python;

// lê um ficheiro de texto para head/tail/wc/grep (mostra o erro se não der)
function lerTexto(a, nomeCmd) {
  if (!a) { linha(`${nomeCmd}: falta o nome do ficheiro`, 'erro'); return null; }
  const abs = normalizar(a, E.cwd), n = obter(abs);
  if (n === undefined) { linha(`${nomeCmd}: ${a}: Ficheiro ou diretoria inexistente`, 'erro'); return null; }
  if (ehDir(n)) { linha(`${nomeCmd}: ${a}: É uma diretoria`, 'erro'); return null; }
  if (n === '\u0000BINARIO') { linha(`${nomeCmd}: ${a}: ficheiro binário (não é texto)`, 'erro'); return null; }
  return { abs, txt: n, nome: a };
}
function mostrarParte(args, qual) {
  let n = 10;
  const iN = args.indexOf('-n');
  if (iN >= 0) n = +args[iN + 1] || 10;
  const curto = args.find(a => /^-\d+$/.test(a)); if (curto) n = +curto.slice(1);
  const nome = args.filter((a, k) => !a.startsWith('-') && !(iN >= 0 && k === iN + 1))[0];
  const f = lerTexto(nome, qual); if (!f) return;
  const ls = f.txt.replace(/\n$/, '').split('\n');
  for (const l of qual === 'head' ? ls.slice(0, n) : ls.slice(-n)) linha(l);
  verCmd({ nome: qual, abs: f.abs, linhas: ls });
}
// a missão decide que comandos contam como passos
function verCmd(info) { for (const f of (M.verificarCmd ? M.verificarCmd(info) : [])) facto(f); }
// comandos que só existem numa missão (ex.: firewall)
const API = { linha, facto: n => facto(n), espera, esc, avisar: (...a) => avisar(...a), estado: () => E, gravar: () => gravar(), marcarNovo: id => WM.marcarNovo(id) };
if (M.comandos) Object.assign(comandos, M.comandos(API));
comandos.vi = comandos.vim = comandos.nano;

function sugerir(nome) {
  const n = obter(E.cwd); if (!ehDir(n)) return null;
  return Object.keys(n).find(k => k.toLowerCase() === nome.toLowerCase() && k !== nome) || null;
}

async function senhaSSH(valor) {
  linha('palavra-passe: ', 'eco');
  if (valor === M.servidor.senha) {
    ssh = null; atualizarPrompt();
    await entrarFarol();
  } else {
    ssh.tent++;
    if (ssh.tent >= 3) { ssh = null; atualizarPrompt(); linha(`${M.servidor.user}@${M.servidor.ip}: Permission denied (3 tentativas erradas).`, 'erro'); linha('Dica: a palavra-passe está ao contrário na mensagem. O Python vira-a.', 'dim'); }
    else linha('Permissão negada, tenta outra vez.', 'erro');
  }
}

async function entrarFarol() {
  ocupado = true;
  const L = [
    ['', ''],
    ['  ███████  █████  ██████   ██████  ██      ', 'ok'],
    ['  ██      ██   ██ ██   ██ ██    ██ ██      ', 'ok'],
    ['  █████   ███████ ██████  ██    ██ ██      ', 'ok'],
    ['  ██      ██   ██ ██   ██ ██    ██ ██      ', 'ok'],
    ['  ██      ██   ██ ██   ██  ██████  ███████ ', 'ok'],
    ['', ''],
    ['Bem-vinda de volta, marta.', ''],
    ['Último login: sex 20 mar 2009 03:14 a partir de 10.0.0.66', 'dim'],
    ['marta@farol:~$ ls', 'eco'],
    ['clientes.db   registos/   NAO_ABRIR.txt', ''],
    ['', ''],
    ['[!] AVISO: o utilizador rui@vigia também está ligado.', 'warn'],
    ['[!] rui@vigia escreveu: quem és tu?', 'warn'],
    ['[!] rui@vigia escreveu: a marta não volta. sai daqui.', 'erro'],
    ['', ''],
    ['Connection to 10.0.0.7 closed by remote host.', 'erro']
  ];
  for (const [t, c] of L) { linha(t, c); await espera(t ? 260 : 120); }
  ocupado = false;
  facto('ssh');
}

function executar(texto) {
  const t = texto.trim();
  if (ssh) { senhaSSH(texto); return; }
  linha(`<span class="p">${esc(promptTxt())}</span> ${esc(texto)}`, 'eco', true);
  if (!t) return;
  E.hist.push(t); if (E.hist.length > 100) E.hist.shift();
  histPos = -1;
  const partes = t.match(/"[^"]*"|'[^']*'|\S+/g).map(p => p.replace(/^["']|["']$/g, ''));
  const [nome, ...args] = partes;
  const f = comandos[nome];
  if (f) f(args);
  else if (comandos[nome.toLowerCase()]) linha(`bash: ${nome}: comando não encontrado. Os comandos escrevem-se em minúsculas: ${nome.toLowerCase()}`, 'erro');
  else linha(`bash: ${nome}: comando não encontrado. Escreve help para ver os comandos.`, 'erro');
  gravar();
}

function completar() {
  const v = cmd.value;
  const m = v.match(/^(.*?)(\S*)$/);
  const antes = m[1], parcial = m[2];
  if (!antes.trim()) { // completar comando
    const op = Object.keys(comandos).filter(c => c.startsWith(parcial));
    if (op.length === 1) cmd.value = op[0] + ' ';
    else if (op.length > 1) linha(op.join('   '), 'dim');
    return;
  }
  const i = parcial.lastIndexOf('/');
  const dirParte = i >= 0 ? parcial.slice(0, i + 1) : '';
  const nomeParte = i >= 0 ? parcial.slice(i + 1) : parcial;
  const n = obter(normalizar(dirParte || '.', E.cwd));
  if (!ehDir(n)) return;
  const op = Object.keys(n).filter(k => k.startsWith(nomeParte) && (nomeParte.startsWith('.') || !k.startsWith('.')));
  if (op.length === 1) {
    const k = op[0];
    cmd.value = antes + dirParte + k + (ehDir(n[k]) ? '/' : ' ');
  } else if (op.length > 1) {
    let pref = op[0];
    for (const o of op) while (!o.startsWith(pref)) pref = pref.slice(0, -1);
    if (pref.length > nomeParte.length) cmd.value = antes + dirParte + pref;
    else linha(op.join('   '), 'dim');
  }
}

const livre = async () => { while (ocupado) await espera(100); };
$('#formCmd').addEventListener('submit', async e => {
  e.preventDefault();
  const v = cmd.value; cmd.value = '';
  await livre();          // se o computador ainda está a arrancar, o comando espera e corre a seguir
  executar(v);
  if (!mobil()) cmd.focus({ preventScroll: true });
});
cmd.addEventListener('keydown', e => {
  if (e.key === 'Tab') { e.preventDefault(); completar(); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); historico(-1); }
  else if (e.key === 'ArrowDown') { e.preventDefault(); historico(1); }
  else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); comandos.clear(); }
});
function historico(d) {
  if (ssh || !E.hist.length) return;
  if (histPos === -1) histPos = E.hist.length;
  histPos = Math.max(0, Math.min(E.hist.length, histPos + d));
  cmd.value = E.hist[histPos] || '';
}
term.addEventListener('click', () => { if (!getSelection().toString()) cmd.focus({ preventScroll: true }); });
$('#teclas').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  if (b.dataset.k === 'tab') completar();
  else if (b.dataset.k === 'up') historico(-1);
  else if (b.dataset.t) {
    const t = b.dataset.t;
    if (t.endsWith(' ')) cmd.value = t; else { cmd.value = ''; executar(t); }
  }
  cmd.focus({ preventScroll: true });
});

/* ---------- Python (Pyodide) ---------- */
const codigo = $('#codigo'), numeros = $('#numeros'), pySaida = $('#pySaida'), pyEstado = $('#pyEstado'), btnRun = $('#btnRun');
let pyodide = null, pyPromessa = null;

function prepararPython() {
  if (pyPromessa) return pyPromessa;
  pyEstado.textContent = 'A carregar Python… (só da 1.ª vez)';
  pyPromessa = new Promise((ok, falha) => {
    const s = document.createElement('script');
    s.src = PYODIDE_URL + 'pyodide.js';
    s.onload = ok; s.onerror = () => falha(new Error('rede'));
    document.head.appendChild(s);
  }).then(() => window.loadPyodide({ indexURL: PYODIDE_URL }))
    .then(p => {
      pyodide = p;
      p.setStdout({ batched: t => pyEscrever(t + '\n') });
      p.setStderr({ batched: t => pyEscrever(t + '\n', 'erro') });
      // Copiar o sistema de ficheiros do jogo para o Python
      const copiar = (n, base) => {
        for (const [k, v] of Object.entries(n)) {
          const c = base + '/' + k;
          if (ehDir(v)) { p.FS.mkdirTree(c); copiar(v, c); }
          else p.FS.writeFile(c, v === '\u0000BINARIO' ? new Uint8Array([255, 216, 255, 224, 0, 16, 74, 70, 73, 70]) : v);
        }
      };
      copiar(FS, '');
      pyEstado.textContent = 'Python 3 pronto'; pyEstado.classList.add('pronto');
      return p;
    })
    .catch(e => {
      pyPromessa = null;
      pyEstado.textContent = 'Falhou a carregar o Python';
      pySaida.innerHTML = '<span class="erro">Não foi possível carregar o Python. Verifica a ligação à internet e carrega outra vez em ▶ Executar.</span>';
      throw e;
    });
  return pyPromessa;
}

let pyBuffer = '';
function pyEscrever(t, cls) {
  pyBuffer += t;
  const s = document.createElement('span');
  if (cls) s.className = cls;
  s.textContent = t;
  pySaida.appendChild(s);
  pySaida.scrollTop = pySaida.scrollHeight;
}

const DICAS = [
  [/SyntaxError.*\?\?\?|invalid syntax/i, 'Erro de sintaxe: o Python não percebeu uma linha. Se ainda tens <code>???</code> no código, troca-o pelo que falta (lê as notas).'],
  [/SyntaxError/, 'Erro de sintaxe: falta ou sobra algum símbolo (aspas, parênteses, dois pontos). Vê a linha indicada.'],
  [/IndentationError/, 'Erro de indentação: no Python os espaços no início da linha contam. Linhas dentro de um <code>with</code> levam 4 espaços.'],
  [/NameError: name '(\w+)'/, m => `O Python não conhece <code>${esc(m[1])}</code>. Escreveste bem o nome? Se for texto, põe-no entre aspas.`],
  [/AttributeError: module 'base64' has no attribute '(\w+)'/, m => `Escreveste <code>base64.${esc(m[1])}</code>, mas a caixa de ferramentas <code>base64</code> não tem nenhuma ferramenta com esse nome.<br>O nome certo é <code>b64decode</code> — começa por <b>b64</b>, sem a palavra “base”. O <code>base64.</code> antes já lá estava, não se repete.<br>A linha tem de ficar assim:<br><code>texto = base64.b64decode(codificado).decode("utf-8")</code>`],
  [/FileNotFoundError/, 'Ficheiro não encontrado. Confirma o caminho entre aspas, letra a letra (maiúsculas contam).'],
  [/IndexError/, 'Essa posição não existe na lista. Lembra-te: as posições contam-se a partir do <b>0</b>, e a última é o tamanho menos 1.'],
  [/TypeError: list indices must be integers/, 'Dentro dos parênteses retos tem de estar um <b>número</b> (a posição), sem aspas.'],
  [/binascii\.Error|Incorrect padding|Invalid base64/, 'Isso não é base64 válido. Estás a descodificar o conteúdo do ficheiro mensagem.b64?'],
  [/UnicodeDecodeError/, 'Esses bytes não são texto. Estás a ler o ficheiro certo?']
];

async function correr() {
  const src = codigo.value;
  if (cmd.value.trim() && (src === CODIGO_INICIAL || !M.passos[indiceAtual()] || !M.passos[indiceAtual()].codigo)) {
    pySaida.innerHTML = '';
    const s = document.createElement('span'); s.className = 'dica';
    s.innerHTML = `💡 Tens <code>${esc(cmd.value.trim())}</code> escrito no <b>terminal</b> (em cima), mas ainda não foi enviado. Clica no terminal e carrega em <kbd>Enter</kbd> — este botão ▶ Executar é só para código Python.`;
    pySaida.appendChild(s);
    mostrarAba('terminal'); cmd.focus({ preventScroll: true });
    return;
  }
  pySaida.innerHTML = ''; pyBuffer = '';
  btnRun.disabled = true;
  try {
    pyEscrever('A executar…\n', 'dim');
    const p = await prepararPython();
    pySaida.innerHTML = '';
    const ns = p.globals.get('dict')();
    try {
      p.runPython(`import os\nos.chdir(${JSON.stringify(E.cwd)})`);
      await p.runPythonAsync(src, { globals: ns });
      if (!pyBuffer.trim()) pyEscrever('(o programa correu mas não mostrou nada — usa print() para ver resultados)\n', 'dim');
      mostrarCaixas(p, ns);
    } catch (err) {
      const msg = String(err.message || err);
      const linhas = msg.trim().split('\n');
      // mostrar só a parte útil do traceback (sem as linhas internas do Pyodide)
      const ini = linhas.findIndex(l => l.includes('File "<exec>"'));
      pyEscrever((ini >= 0 ? linhas.slice(ini).join('\n').replace(/File "<exec>"/g, 'script.py') : linhas.slice(-3).join('\n')) + '\n', 'erro');
      for (const [re, d] of DICAS) {
        const m = msg.match(re);
        if (m) { const s = document.createElement('span'); s.className = 'dica'; s.innerHTML = '💡 ' + (typeof d === 'function' ? d(m) : d); pySaida.appendChild(s); break; }
      }
      // num passo com solução, oferecer correção automática
      const passo = M.passos[indiceAtual()];
      if (passo && passo.solucao) {
        const b = document.createElement('button'); b.className = 'btn-corrigir'; b.textContent = '✍ Corrigir por mim';
        b.onclick = () => { porCodigo(passo.solucao); pySaida.innerHTML = '<span class="dica">✓ Código corrigido. Vê o que mudou e carrega em ▶ Executar.</span>'; };
        pySaida.appendChild(b);
      }
    } finally { ns.destroy(); }
    verificarPython(pyBuffer, src);
    pySaida.scrollTop = 0;   // mostrar o resultado desde o início
  } catch (e) { /* falha de carregamento já mostrada */ }
  btnRun.disabled = false;
}

// 📦 mostra as variáveis (caixas) e módulos (caixas de ferramentas) que ficaram na memória
function mostrarCaixas(p, ns) {
  let lista = [];
  try {
    const r = p.runPython(`[(k, type(v).__name__, repr(v)) for k, v in list(globals().items()) if not k.startswith('__')]`, { globals: ns });
    lista = r.toJs(); r.destroy();
  } catch (e) { return; }
  const itens = [];
  for (const [k, tipo, rep] of lista) {
    if (tipo === 'module') itens.push(`<span class="cm-ferr">🧰 <b>${esc(k)}</b> <i>caixa de ferramentas</i></span>`);
    else if (tipo === 'function' || tipo === 'builtin_function_or_method' || tipo === 'type') continue;
    else if (/IOWrapper/.test(tipo)) itens.push(`<span class="cm-cx">📄 <b>${esc(k)}</b> <i>ficheiro (já fechado)</i></span>`);
    else {
      const v = rep.length > 46 ? rep.slice(0, 44) + '…' + rep.slice(-1) : rep;
      const t = { str: 'texto', int: 'número', float: 'número', bytes: 'bytes', bool: 'sim/não', list: 'lista', dict: 'dicionário', Counter: 'contagem' }[tipo] || tipo;
      itens.push(`<span class="cm-cx">📦 <b>${esc(k)}</b> = <code>${esc(v)}</code> <i>${t}</i></span>`);
    }
  }
  if (!itens.length) return;
  const d = document.createElement('div'); d.className = 'caixas-mem';
  d.innerHTML = '<div class="cm-tit">📦 Caixas na memória (variáveis)</div>' + itens.join('');
  pySaida.appendChild(d);
}

function verificarPython(out, src = '') {
  for (const f of (M.verificarPy ? M.verificarPy(out, src) : [])) facto(f);
}

/* cores do código: comentário, texto, variável, função, palavra do Python, módulo */
const realce = $('#realce');
const PALAVRAS = new Set(['import', 'from', 'as', 'with', 'def', 'return', 'for', 'in', 'if', 'elif', 'else', 'while', 'and', 'or', 'not', 'True', 'False', 'None', 'try', 'except', 'class', 'is', 'break', 'continue', 'pass', 'lambda']);
const RE_PY = /(#[^\n]*)|("(?:[^"\\\n]|\\.)*"?|'(?:[^'\\\n]|\\.)*'?)|(\?\?\?)|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_]\w*)\b(?=(\s*\()?)/g;
function colorir(src) {
  const modulos = new Set(['base64', 'os', 'random', 'collections', ...[...src.matchAll(/^\s*import\s+(\w+)/gm)].map(m => m[1])]);
  let out = '', i = 0, m;
  RE_PY.lastIndex = 0;
  while ((m = RE_PY.exec(src))) {
    if (!m[0]) { RE_PY.lastIndex++; continue; }
    out += esc(src.slice(i, m.index));
    let cls;
    if (m[1]) cls = 'c-com';
    else if (m[2]) cls = 'c-txt';
    else if (m[3]) cls = 'c-falta';
    else if (m[4]) cls = 'c-num';
    else if (PALAVRAS.has(m[5])) cls = 'c-kw';
    else if (m[6] !== undefined) cls = 'c-fn';
    else if (modulos.has(m[5])) cls = 'c-mod';
    else cls = 'c-var';
    out += `<span class="${cls}">${cls === 'c-txt' ? esc(m[0]).replace(/\?\?\?/g, '<span class="c-falta">???</span>') : esc(m[0])}</span>`;
    i = m.index + m[0].length;
  }
  return out + esc(src.slice(i)) + '\n';
}
function atualizarNumeros() {
  const n = codigo.value.split('\n').length;
  let s = ''; for (let i = 1; i <= n; i++) s += i + '\n';
  numeros.textContent = s;
  realce.innerHTML = colorir(codigo.value);
  sincronizarScroll();
}
function sincronizarScroll() {
  numeros.scrollTop = codigo.scrollTop;
  realce.scrollTop = codigo.scrollTop; realce.scrollLeft = codigo.scrollLeft;
}
codigo.addEventListener('input', () => { atualizarNumeros(); E.codigo = codigo.value; gravar(); });
codigo.addEventListener('scroll', sincronizarScroll);
codigo.addEventListener('focus', prepararPython, { once: true });
codigo.addEventListener('keydown', e => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); correr(); return; }
  if (e.key === 'Tab' && !e.shiftKey) {
    e.preventDefault();
    const a = codigo.selectionStart, b = codigo.selectionEnd;
    codigo.setRangeText('    ', a, b, 'end'); codigo.dispatchEvent(new Event('input'));
  } else if (e.key === 'Enter') {
    // manter a indentação da linha anterior (+4 depois de ":")
    const a = codigo.selectionStart;
    const ini = codigo.value.lastIndexOf('\n', a - 1) + 1;
    const atual = codigo.value.slice(ini, a);
    let ind = atual.match(/^ */)[0];
    if (/:\s*$/.test(atual)) ind += '    ';
    if (ind) { e.preventDefault(); codigo.setRangeText('\n' + ind, a, codigo.selectionEnd, 'end'); codigo.dispatchEvent(new Event('input')); }
  }
});
btnRun.addEventListener('click', correr);
// colar uma linha só (ex.: copiada do Terminal): tirar a mudança de linha do fim,
// para não partir o texto entre aspas
codigo.addEventListener('paste', e => {
  const t = (e.clipboardData && e.clipboardData.getData('text')) || '';
  const limpo = t.replace(/\r/g, '').replace(/^\n+|\n+$/g, '');
  if (limpo === t || limpo.includes('\n')) return;
  e.preventDefault();
  codigo.setRangeText(limpo, codigo.selectionStart, codigo.selectionEnd, 'end');
  codigo.dispatchEvent(new Event('input'));
});

const CODIGO_INICIAL =
'# Editor de Python deste computador.\n' +
'# Escreve código e carrega em ▶ Executar (ou Ctrl+Enter).\n\n' +
'print("Olá, computador velho!")\n';
function porCodigo(c) { codigo.value = c; atualizarNumeros(); E.codigo = c; gravar(); }

/* ---------- missão: passos ---------- */
const olPassos = $('#passos');
const indiceAtual = () => { const i = M.passos.findIndex(p => !E.factos[p.facto]); return i < 0 ? M.passos.length : i; };

function facto(nome) {
  if (E.factos[nome]) return;
  const antes = indiceAtual();
  E.factos[nome] = true;
  // ssh certo vale pela missão toda
  if (nome === 'ssh') for (const p of M.passos) E.factos[p.facto] = true;
  const depois = indiceAtual();
  gravar();
  chegouMail(nome);
  if (depois !== antes) {
    const feito = M.passos[antes];
    // passos de Python: parar para a pessoa ver o resultado e ler o que aconteceu
    if (feito && feito.feito && !saltando && depois < M.passos.length) {
      E.pendente = antes; gravar();
      desenharPassos();
      if (feito.codigo) {
        const d = document.createElement('div'); d.className = 'py-ok';
        d.innerHTML = '<b>✓ Conseguiste!</b> Vê o resultado aqui em cima e lê nas <b>Notas</b> o que aconteceu. <button data-acao="continuar">Continuar →</button>';
        pySaida.appendChild(d);
      }
      avisar('✓ Conseguiste! Lê nas notas <b>o que aconteceu</b>.', WM.ativa() === 'notas' ? null : 'Ver notas');
      marcarNovo('missao');
      return;
    }
    entrarPasso(depois);
  }
}

let saltando = false;
function continuar() {
  pySaida.querySelectorAll('.py-ok').forEach(x => x.remove());
  if (E.pendente == null) return;
  E.pendente = null; gravar();
  entrarPasso(indiceAtual());
  mostrarAba('missao');
}
function entrarPasso(i) {
  desenharPassos();
  const p = M.passos[i];
  if (i >= M.passos.length) { E.fim = E.fim || Date.now(); gravar(); setTimeout(mostrarFim, 900); return; }
  if (p.codigo) {
    porCodigo(p.codigo);
    pySaida.innerHTML = '<span class="dim">O editor tem um programa novo. Lê as notas e carrega em ▶ Executar.</span>';
    prepararPython();
  }
  if (p.abre && WM.ativa() !== p.abre) WM.marcarNovo(p.abre);
  if (M.aoEntrarPasso) M.aoEntrarPasso(p, API);
  avisar(`➜ Próximo passo: <b>${esc(p.titulo)}</b>`, WM.ativa() === 'notas' ? null : 'Ver notas');
  marcarNovo('missao');
}
pySaida.addEventListener('click', e => { if (e.target.closest('[data-acao="continuar"]')) continuar(); });

function desenharPassos() {
  const pend = E.pendente != null && E.pendente < indiceAtual() ? E.pendente : null;
  const atual = pend != null ? pend + 1 : indiceAtual();
  olPassos.innerHTML = '';
  M.passos.forEach((p, i) => {
    const li = document.createElement('li');
    const futuro = i > atual || (pend != null && i === atual);
    li.className = 'passo ' + (i < atual ? 'feito' : futuro ? 'futuro' : 'atual') + (i === pend ? ' pendente' : '');
    li.innerHTML = `<h2>${esc(p.titulo)}</h2>` + (i === pend ? `<div class="resultado"><div class="res-tit">✓ Conseguiste! O que aconteceu:</div>${p.feito}<button class="btn" data-acao="continuar">Continuar →</button></div>` : '') + (futuro ? '' : `
      <div class="corpo">
        <p>${p.historia}</p>
        <div class="aprende">${p.aprende}</div>
        ${p.explica ? `<div class="explica"><div class="explica-tit">🔍 ${esc(p.explicaTitulo || 'Como funciona')}</div>${p.explica.map(([c, t]) => `<div class="ex-linha"><code class="cod">${colorir(c).replace(/\n$/, '')}</code><span>${t}</span></div>`).join('')}</div>` : ''}
        <div class="tarefa">${p.tarefa}${p.antesDepois ? `<div class="antes-depois"><div><small>ANTES</small>${p.antesDepois[0]}</div><div class="ok-l"><small>DEPOIS</small>${p.antesDepois[1]}</div></div>` : ''}</div>
        <div class="acoes">
          <button data-acao="pista">💡 Pista</button>
          ${p.solucao ? '<button data-acao="solucao">✍ Escrever por mim</button>' : ''}
          ${p.licao ? '<button data-acao="saltar" title="Para quem já programa">⏭ Já sei isto — saltar</button>' : ''}
          ${p.codigo ? '<button data-acao="codigo">↺ Começar o código de novo</button>' : ''}
          ${p.codigo ? '<button data-acao="ir-python">🐍 Abrir Python</button>' : '<button data-acao="ir-terminal">&gt;_ Ir ao terminal</button>'}
        </div>
        <div class="pista">${p.pista}</div>
      </div>`);
    li.dataset.i = i;
    olPassos.appendChild(li);
  });
  if (atual >= M.passos.length) {
    const li = document.createElement('li');
    li.innerHTML = `<div class="passo-final"><b>Missão ${M.numero} concluída.</b><br>${SEGUINTE ? `A missão ${SEGUINTE.numero} já te espera.` : 'A próxima missão está a caminho.'}<br><button class="btn" data-acao="fim">Ver resumo</button></div>`;
    olPassos.appendChild(li);
  }
  const n = Math.min(atual, M.passos.length);
  $('#contaPassos').textContent = `${n}/${M.passos.length}`;
  $('#barra').style.width = (100 * n / M.passos.length) + '%';
  const elAtual = olPassos.querySelector('.atual');
  if (elAtual) setTimeout(() => elAtual.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 50);
}

olPassos.addEventListener('click', e => {
  const c = e.target.closest('code.cmd');
  if (c) {
    const t = c.textContent.trim();
    return;
  }
  const b = e.target.closest('[data-acao]');
  const li = e.target.closest('.passo');
  if (b) {
    const a = b.dataset.acao;
    if (a === 'pista') li.querySelector('.pista').classList.toggle('ver');
    else if (a === 'codigo') { porCodigo(M.passos[li.dataset.i].codigo); mostrarAba('python'); }
    else if (a === 'saltar') { saltando = true; facto(M.passos[li.dataset.i].facto); saltando = false; }
    else if (a === 'continuar') continuar();
    else if (a === 'solucao') { porCodigo(M.passos[li.dataset.i].solucao); mostrarAba('python'); avisar('Pronto, o código está escrito. Agora carrega em <b>▶ Executar</b>.'); }
    else if (a === 'ir-python') { mostrarAba('python'); prepararPython(); }
    else if (a === 'ir-terminal') { mostrarAba('terminal'); cmd.focus({ preventScroll: true }); }
    else if (a === 'fim') mostrarFim();
    return;
  }
  if (li && li.classList.contains('feito') && e.target.closest('h2')) li.classList.toggle('aberto');
});

/* ---------- janelas do ambiente de trabalho ---------- */
const mobil = WM.mobil;
const JANELA = { missao: 'notas', terminal: 'terminal', python: 'python' };
function mostrarAba(a) {
  const id = JANELA[a] || a;
  WM.abrir(id);
  if (id === 'terminal') setTimeout(rolar, 0);
}
function marcarNovo(a) { WM.marcarNovo(JANELA[a] || a); }
WM.on((tipo, id) => {
  if (tipo === 'focar' && id === 'terminal') { setTimeout(rolar, 0); if (!mobil()) cmd.focus({ preventScroll: true }); }
  if (tipo === 'focar' && id === 'correio') desenharCorreio();
});

function avisar(html, botao, acao, cls) {
  const box = $('#avisos');
  const el = document.createElement('div');
  el.className = 'aviso' + (cls ? ' ' + cls : '');
  el.innerHTML = `<span>${html}</span>` + (botao ? `<button>${botao}</button>` : '');
  const b = el.querySelector('button');
  if (b) b.onclick = () => { el.remove(); (acao || (() => mostrarAba('missao')))(); };
  box.appendChild(el);
  while (box.children.length > 2) box.firstChild.remove();
  setTimeout(() => el.remove(), cls === 'mail' ? 9000 : 5000);
}

// comandos verdes clicáveis (nas notas e no visualizador) vão para o terminal
document.addEventListener('click', e => {
  const c = e.target.closest('code.cmd');
  if (!c) return;
  e.stopPropagation();
  mostrarAba('terminal');
  cmd.value = c.textContent.trim();
  cmd.focus({ preventScroll: true });
}, true);

/* ---------- ícones do ambiente de trabalho ---------- */
const LIXO = M.home + '/.local/share/Trash/files';
WM.desenharIcones([['lixo', 'Lixo', 'lixo']]);
function abrirApp(id) {
  if (id === 'lixo') { fmIr(LIXO); WM.abrir('ficheiros'); }
  else if (id === 'ficheiros') { if ($('#win-ficheiros').hidden) fmIr(M.home); WM.abrir('ficheiros'); }
  else { WM.abrir(id); if (id === 'python') prepararPython(); }
}
$('#icones').addEventListener('click', e => { const b = e.target.closest('.icone'); if (b) abrirApp(b.dataset.app); });
$('#menuApps').addEventListener('click', e => { const b = e.target.closest('button[data-app]'); if (b) abrirApp(b.dataset.app); });
$('#tarefasMissao').addEventListener('click', () => mostrarAba('missao'));

/* ---------- gestor de ficheiros ---------- */
let fmDir = M.home;
const fmOcultos = $('#fmOcultos');
function tipoIcone(nome, n) {
  if (ehDir(n)) return nome.startsWith('.') ? 'pastaOculta' : 'pasta';
  if (n === '\u0000BINARIO') return 'imagem';
  if (/\.py$/.test(nome)) return 'codigo';
  return 'texto';
}
function fmIr(abs) { fmDir = abs; desenharFM(); }
function desenharFM() {
  const n = obter(fmDir);
  if (!ehDir(n)) { fmDir = M.home; return desenharFM(); }
  const nome = fmDir === '/' ? '/' : fmDir.split('/').pop();
  $('#fmTitulo').textContent = (fmDir === LIXO ? 'Lixo' : nome) + ' — Ficheiros';
  $('#fmCaminho').textContent = fmDir;
  let itens = Object.keys(n).sort((a, b) => (ehDir(n[b]) - ehDir(n[a])) || a.replace(/^\./, '').localeCompare(b.replace(/^\./, ''), 'pt', { sensitivity: 'base' }));
  const ocultos = itens.filter(x => x.startsWith('.')).length;
  if (!fmOcultos.checked) itens = itens.filter(x => !x.startsWith('.'));
  $('#fmGrelha').innerHTML = itens.length
    ? itens.map(x => `<button class="fm-item${x.startsWith('.') ? ' oculto-f' : ''}" data-nome="${esc(x)}"><span class="ico">${WM.ICONES[tipoIcone(x, n[x])]}</span>${esc(x)}</button>`).join('')
    : `<div class="fm-vazio">${fmDir === LIXO ? 'O lixo está vazio.' : 'Esta pasta está vazia.'}</div>`;
  $('#fmRodape').textContent = `${itens.length} ite${itens.length === 1 ? 'm' : 'ns'}` + (!fmOcultos.checked && ocultos ? ` · ${ocultos} oculto${ocultos > 1 ? 's' : ''} (não aparece${ocultos > 1 ? 'm' : ''})` : '');
  WM.render();
}
$('#fmGrelha').addEventListener('click', e => {
  const b = e.target.closest('.fm-item'); if (!b) return;
  const abs = normalizar(b.dataset.nome, fmDir);
  if (ehDir(obter(abs))) fmIr(abs); else abrirFicheiro(abs);
});
$('#fmCima').onclick = () => fmIr(normalizar('..', fmDir));
$('#fmCasa').onclick = () => fmIr(M.home);
fmOcultos.onchange = () => { desenharFM(); if (fmOcultos.checked && fmDir === M.home) facto('viuOcultoFM'); };
$('#win-ficheiros').addEventListener('keydown', e => { if (e.ctrlKey && e.key.toLowerCase() === 'h') { e.preventDefault(); fmOcultos.checked = !fmOcultos.checked; fmOcultos.onchange(); } });

/* ---------- visualizador ---------- */
function abrirFicheiro(abs) {
  const n = obter(abs);
  const nome = abs.split('/').pop();
  $('#visorTitulo').textContent = nome + ' — Visualizador';
  const corpo = $('#visorCorpo');
  if (n === '\u0000BINARIO') {
    corpo.innerHTML = '<div class="visor-img"><span>⚠ Imagem danificada — só se lê metade.</span></div>';
    $('#visorDica').innerHTML = '';
  } else {
    corpo.textContent = n;
    $('#visorDica').innerHTML = `💡 Isto é o mesmo que escrever no terminal <code class="cmd">cat ${esc(curto(abs))}</code>` +
      (/^(LEIA-ME\.txt|diario\.txt|mensagem\.b64)$/.test(nome) ? ' — <b>para avançar na missão, usa o terminal.</b>' : '');
  }
  WM.abrir('visor');
}

/* ---------- correio ---------- */
const mailsVisiveis = () => M.correio.filter(m => !m.quando || E.factos[m.quando]);
let mailSel = null;
function desenharCorreio() {
  const lidos = E.lidos || (E.lidos = {});
  const lista = mailsVisiveis().slice().reverse();
  $('#mailLista').innerHTML = lista.map(m => `<li data-id="${m.id}" class="${lidos[m.id] || m.lido ? '' : 'nao-lido'}${m.id === mailSel ? ' sel' : ''}">
    <span class="dt">${esc(m.data)}</span><span class="de">${esc(m.de.split(' <')[0])}</span><span class="ass">${esc(m.assunto)}</span></li>`).join('');
  const m = M.correio.find(x => x.id === mailSel);
  $('#win-correio .correio').classList.toggle('lendo', !!m);
  $('#mailLer').innerHTML = m
    ? `<button class="mail-voltar">← Caixa de entrada</button><h3>${esc(m.assunto)}</h3><div class="meta">De: ${esc(m.de)}<br>Para: marta.reis@vigia.pt · ${esc(m.data)}</div><div class="corpo-mail">${esc(m.corpo)}</div>`
    : '<p class="dim">Escolhe uma mensagem.</p>';
  const porLer = mailsVisiveis().filter(x => !lidos[x.id] && !x.lido).length;
  if (porLer) WM.marcarNovo('correio');
}
$('#mailLista').addEventListener('click', e => {
  const li = e.target.closest('li'); if (!li) return;
  mailSel = li.dataset.id; (E.lidos || (E.lidos = {}))[mailSel] = true; gravar(); desenharCorreio(); facto('mail:' + mailSel);
});
$('#mailLer').addEventListener('click', e => { if (e.target.closest('.mail-voltar')) { mailSel = null; desenharCorreio(); } });
function chegouMail(nomeFacto) {
  for (const m of M.correio) if (m.quando === nomeFacto) {
    setTimeout(() => {
      desenharCorreio(); WM.marcarNovo('correio');
      avisar(`✉ <b>Novo e-mail</b> de ${esc(m.de.split(' <')[0])}: “${esc(m.assunto)}”`, 'Abrir', () => { mailSel = m.id; (E.lidos || (E.lidos = {}))[m.id] = true; gravar(); abrirApp('correio'); desenharCorreio(); facto('mail:' + m.id); }, 'mail');
    }, 4000);
  }
}

/* ---------- ecrãs inicial e final ---------- */
function mostrarFim() {
  const ms = (E.fim || Date.now()) - (E.inicio || Date.now());
  const min = Math.max(1, Math.round(ms / 60000));
  $('#fimTempo').textContent = `Tempo: ${min} minuto${min > 1 ? 's' : ''}.`;
  $('#fimLista').innerHTML = '<ul class="lista">' + M.fim.aprendeste.map(x => `<li>${x}</li>`).join('') + '</ul>' + (M.fim.proximo ? `<p class="proximo">${M.fim.proximo}</p>` : '');
  $('#fimTeaser').innerHTML = M.fim.teaser;
  $('#fimSelo').textContent = `MISSÃO ${M.numero} CONCLUÍDA`;
  $('#fimTitulo').textContent = M.fim.titulo || 'Missão concluída.';
  $('#btnProxima').hidden = !SEGUINTE;
  if (SEGUINTE) $('#btnProxima').textContent = `▶ Começar a missão ${SEGUINTE.numero}`;
  $('#fimNota').textContent = SEGUINTE
    ? 'Se estás a gostar, partilha com alguém que queira aprender — é isso que decide se o jogo continua.'
    : `A missão ${M.numero + 1} ainda está a ser escrita. Se gostaste, partilha com alguém que queira aprender — é isso que decide se o jogo continua.`;
  $('#ecraFim').hidden = false;
}
$('#btnFechar').onclick = () => { $('#ecraFim').hidden = true; };
$('#btnProxima').onclick = () => { location.href = location.pathname + '?m=' + SEGUINTE.numero; };
$('#btnPartilhar').onclick = async () => {
  const dados = { title: 'FAROL · jogo de hacker em português', text: 'Aprende terminal e Python a investigar um computador velho. Grátis, no navegador:', url: location.href.split(/[?#]/)[0] };
  try {
    if (navigator.share) await navigator.share(dados);
    else { await navigator.clipboard.writeText(dados.text + ' ' + dados.url); avisar('Link copiado!'); }
  } catch (e) {}
};

function abrirJanelasIniciais() {
  // começa só com as notas: o jogador abre o Terminal e o Python pelos ícones, quando as notas mandarem
  const i = indiceAtual();
  const jaAbertas = new Set(M.passos.slice(0, i).map(p => p.abre).filter(Boolean));
  if (jaAbertas.has('python')) WM.abrir('python', { semFoco: true });
  if (jaAbertas.has('terminal')) WM.abrir('terminal', { semFoco: true });
  WM.abrir('notas');
  const p = M.passos[i];
  if (p && p.abre && !jaAbertas.has(p.abre)) WM.marcarNovo(p.abre);
  if (p && M.aoEntrarPasso && E.pendente == null) M.aoEntrarPasso(p, API);
}

// ecrã preto de arranque, linha a linha; um clique ou uma tecla salta
async function ecraArranque() {
  const sp = $('#splash'), txt = $('#bootTxt');
  txt.innerHTML = ''; sp.hidden = false;
  let saltar = false;
  const salta = () => { saltar = true; };
  sp.addEventListener('click', salta); document.addEventListener('keydown', salta);
  const pausa = async ms => { const fim = Date.now() + ms; while (!saltar && Date.now() < fim) await espera(40); };
  for (const [t, c, ms] of (M.arranque || [])) {
    if (saltar) break;
    const el = document.createElement('div');
    el.className = 'bl ' + (c || '');
    el.textContent = t || ' ';
    txt.appendChild(el);
    if (c === 'mem') {
      for (let kb = 0; kb <= 524288 && !saltar; kb += 32768) { el.textContent = `Memória: ${kb} KB`; await pausa(45); }
      el.textContent = 'Memória: 524288 KB  OK';
    } else if (c === 'pontos') {
      el.textContent = '';
      for (let k = 0; k < t.length && !saltar; k++) { el.textContent += '.'; await pausa(160); }
    }
    await pausa(ms || 0);
  }
  sp.removeEventListener('click', salta); document.removeEventListener('keydown', salta);
  sp.classList.add('a-sair'); await espera(400);
  sp.hidden = true; sp.classList.remove('a-sair');
}

// o ambiente de trabalho aparece vazio; um programa de arranque abre as notas
async function abrirPorPrograma() {
  const prog = M.notas && M.notas.programa, fich = (M.notas && M.notas.ficheiro) || 'notas.txt';
  await espera(900);
  const caixa = document.createElement('div');
  caixa.className = 'prog-arranque';
  caixa.innerHTML = prog
    ? `<div class="pa-tit">⚙ ${esc(prog)}</div><div>Programa de arranque a correr…</div><div class="pa-acao">→ a abrir <b>${esc(fich)}</b></div>`
    : `<div class="pa-tit">📎 Anexo recebido</div><div class="pa-acao">→ a abrir <b>${esc(fich)}</b></div>`;
  document.body.appendChild(caixa);
  await espera(2300);
  caixa.classList.add('a-sair'); await espera(300); caixa.remove();
  abrirJanelasIniciais();
}

async function arrancar(novo) {
  $('#ecraIntro').hidden = true;
  if (novo || !E.comecou) {
    E = estadoNovo(); E.comecou = true; E.inicio = Date.now();
    saida.innerHTML = ''; ssh = null; mailSel = null;
    document.querySelectorAll('.janela').forEach(w => { w.hidden = true; w.classList.remove('min', 'max', 'ativa'); delete w.dataset.posto; });
    porCodigo(CODIGO_INICIAL);
    desenharPassos(); atualizarPrompt(); fmOcultos.checked = false; fmIr(M.home); desenharCorreio();
    ocupado = true;
    await ecraArranque();
    WM.relogio(E.inicio, M.relogio);
    for (const [t, c] of M.boot) linha(t, c);
    await abrirPorPrograma();
    if (!mobil()) cmd.focus({ preventScroll: true });
    ocupado = false;
    gravar();
  } else {
    WM.relogio(E.inicio, M.relogio);
    abrirJanelasIniciais();
  }
  if (!mobil()) cmd.focus({ preventScroll: true });
}

$('#btnRecomecar').onclick = () => {
  if (confirm('Recomeçar a missão do início? Perdes o progresso.')) {
    try { localStorage.removeItem(CHAVE); } catch (e) {}
    $('#ecraFim').hidden = true;
    arrancar(true);
  }
};

/* ---------- início ---------- */
carregar();
$('#introTexto').innerHTML = M.intro.map(p => `<p>${p}</p>`).join('');
$('#tituloMissao').textContent = M.titulo; $('#numMissao').textContent = M.numero;
// de onde vêm estas notas (quem as escreveu e porquê)
$('#tituloNotas').textContent = ((M.notas && M.notas.ficheiro) || 'notas.txt') + ' — Notas';
if (M.notas && M.notas.carta) { $('#cartaNotas').innerHTML = M.notas.carta; $('#cartaNotas').hidden = false; }
document.title = `FAROL · Missão ${M.numero}`;
$('#introSelo').textContent = `MISSÃO ${M.numero}`;
$('#introTitulo').textContent = M.titulo;
$('#introDuracao').textContent = '⏱ ' + (M.duracao || '~15 minutos');
document.querySelector('.tm-txt').textContent = `Missão ${M.numero}`;
// lista de missões no ecrã inicial
const BREVE = window.MISSOES_BREVE || [];
$('#missoesLista').innerHTML = [...MISSOES, ...BREVE.filter(b => !MISSOES.some(x => x.numero === b.numero))].map(x => {
  const aberta = x.numero === 1 || concluida(x.numero - 1) || x.numero === M.numero;
  const estado = x.breve ? 'breve' : x.numero === M.numero ? 'atual' : concluida(x.numero) ? 'feita' : aberta ? '' : 'fechada';
  const icone = x.breve ? '⏳' : concluida(x.numero) ? '✓' : aberta ? '▶' : '🔒';
  return `<button class="mi ${estado}" data-m="${x.numero}" ${x.breve ? 'disabled' : ''}>${icone} <b>Missão ${x.numero}</b> · ${esc(x.titulo)}${x.breve ? ' <i>(em breve)</i>' : ''}</button>`;
}).join('');
$('#missoesLista').addEventListener('click', e => {
  const b = e.target.closest('.mi'); if (!b || b.disabled) return;
  const n = +b.dataset.m;
  if (n === M.numero) return;
  if (b.classList.contains('fechada')) { avisar(`🔒 Termina primeiro a missão ${n - 1}.`); return; }
  location.href = location.pathname + '?m=' + n;
});
for (const [t, c] of E.linhas) linha(t, c, true, false);
porCodigo(E.codigo || (M.passos[indiceAtual()] || {}).codigo || CODIGO_INICIAL);
desenharPassos(); atualizarPrompt(); desenharFM(); desenharCorreio(); WM.render();
if (E.comecou) {
  $('#btnComecar').textContent = 'Continuar';
  $('#btnDoZero').hidden = false;
  if (M.passos.slice(0, indiceAtual() + 1).some(p => p.codigo)) prepararPython();
}
$('#btnComecar').onclick = () => arrancar(false);
$('#btnDoZero').onclick = () => arrancar(true);
})();
