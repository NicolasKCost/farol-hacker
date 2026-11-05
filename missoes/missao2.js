/* Missão 2 — O Vigia
   Tudo aqui é ficção: ficheiros, rede e pessoas não existem.
   Os IPs "de fora" são de gamas reservadas para exemplos (192.0.2.x, 198.51.100.x, 203.0.113.x). */
(() => {
'use strict';

/* ---------- o registo do FAROL (auth.log), sempre igual ---------- */
let semente = 20090320;
const acaso = () => { semente = (semente * 1103515245 + 12345) % 2147483648; return semente / 2147483648; };
const entre = (a, b) => a + Math.floor(acaso() * (b - a + 1));
const doisD = n => String(n).padStart(2, '0');

const eventos = [];   // [segundos desde 19/03 00:00, texto depois de "farol sshd[pid]: "]
const pidBase = 1800;
function ev(seg, txt) { eventos.push([seg, txt]); }
const S = (dia, h, m, s = 0) => (dia - 19) * 86400 + h * 3600 + m * 60 + s;

// dias normais de trabalho: entradas, saídas e uns enganos de quem trabalha lá
const equipa = [['joao', '10.0.0.12'], ['sofia', '10.0.0.15'], ['pedro', '10.0.0.31'], ['rui', '10.0.0.66'], ['marta', '10.0.0.23'], ['backup', '10.0.0.9']];
for (const dia of [19, 20]) {
  for (const [u, ip] of equipa) {
    const vezes = u === 'backup' ? 24 : u === 'marta' ? entre(10, 15) : entre(55, 75);
    for (let k = 0; k < vezes; k++) {
      const t = u === 'backup' ? S(dia, k, 0, entre(0, 50)) : S(dia, entre(8, 18), entre(0, 59), entre(0, 59));
      if (u === 'marta' && dia === 20 && t > S(20, 17, 0)) continue;   // a Marta desapareceu ao fim do dia 20
      if (acaso() < 0.04 && u !== 'backup' && u !== 'rui') ev(t - entre(5, 30), `Failed password for ${u} from ${ip} port ${entre(40000, 60000)} ssh2`);
      ev(t, `Accepted password for ${u} from ${ip} port ${entre(40000, 60000)} ssh2`);
      ev(t + 1, `pam_unix(sshd:session): session opened for user ${u}`);
      ev(t + entre(60, 3000), `pam_unix(sshd:session): session closed for user ${u}`);
    }
  }
}
// robôs da internet a experimentar palavras-passe ao acaso (ruído)
const robos = [['198.51.100.23', 45, S(20, 1, 10)], ['203.0.113.9', 12, S(19, 22, 40)], ['192.0.2.77', 8, S(19, 4, 5)]];
for (const [ip, n, t0] of robos) for (let k = 0; k < n; k++) ev(t0 + k * entre(8, 20), `Failed password for root from ${ip} port ${entre(30000, 65000)} ssh2`);
for (let k = 0; k < 14; k++) ev(S(entre(19, 20), entre(0, 23), entre(0, 59)), `Failed password for admin from 203.0.113.${entre(100, 199)} port ${entre(30000, 65000)} ssh2`);
// o ataque: 612 tentativas à conta da Marta, de 10.0.0.66, e depois… entra
const ATAQUE = 612;
for (let k = 0; k < ATAQUE; k++) ev(S(20, 2, 51, 0) + Math.round(k * 2.25), `Failed password for marta from 10.0.0.66 port ${51234 + k} ssh2`);
ev(S(20, 3, 14, 7), 'Accepted password for marta from 10.0.0.66 port 51846 ssh2');
ev(S(20, 3, 14, 8), 'pam_unix(sshd:session): session opened for user marta');
ev(S(20, 3, 41, 2), 'pam_unix(sshd:session): session closed for user marta');

eventos.sort((a, b) => a[0] - b[0]);
let pid = pidBase;
const LOG = eventos.map(([seg, txt]) => {
  const dia = 19 + Math.floor(seg / 86400), r = seg % 86400;
  if (/^(Accepted|Failed)/.test(txt)) pid += entre(1, 7);
  return `Mar ${dia} ${doisD(Math.floor(r / 3600))}:${doisD(Math.floor(r / 60) % 60)}:${doisD(r % 60)} farol sshd[${pid}]: ${txt}`;
}).join('\n') + '\n';
const LINHAS = LOG.split('\n').length - 1;
const FALHAS = (LOG.match(/Failed password/g) || []).length;
const EXEMPLO = LOG.split('\n').find(l => l.includes('Failed password'));   // a 1.ª linha que o grep Failed mostra
const EX_P = EXEMPLO.split(/\s+/);

/* ---------- ataque em direto no passo final ---------- */
let ataque = null;
function pararAtaque() { clearInterval(ataque); ataque = null; }

(window.MISSOES = window.MISSOES || []).push({
  id: 'm2',
  numero: 2,
  titulo: 'O Vigia',
  duracao: '~15 minutos',
  relogio: [2009, 2, 21, 0, 20],
  dataTxt: 'sáb 21 mar 2009 00:20:41 WET',
  user: 'marta',
  host: 'sotao',
  home: '/home/marta',

  intro: [
    'São 00:20. O Rui expulsou-te do <b>servidor FAROL</b>: a ligação caiu e perdeste o acesso. Mas tu continuas sentado ao <b>computador da Marta</b>, no sótão, e esse continua a funcionar e ligado à rede.',
    'Acabou de chegar um e-mail de alguém que assina só <b>“M.”</b>. Diz que há uma cópia do registo do servidor neste computador — e que alguém entrou na conta da Marta.',
    'Nesta missão vais investigar um registo com mais de duas mil linhas. Vais aprender comandos para procurar em ficheiros e pôr o Python a ler por ti: <b>listas, for, if e contagens</b>. E no fim vais ter de te defender.'
  ],

  boot: [
    ['A restaurar a sessão de marta…', 'dim'],
    ['[ OK ] Rede: eth0 ligada (10.0.0.23)', 'ok'],
    ['[ !! ] Ligação ao FAROL (10.0.0.7) recusada', 'warn'],
    ['', ''],
    ['Escreve os comandos aqui em baixo e carrega em Enter.', 'info']
  ],

  fs: {
    home: {
      marta: {
        'LEIA-ME.txt': 'Este computador pertence a Marta Reis.\nSe o encontraste, por favor não o formates.\nHá aqui coisas que alguém tem de ver.\n',
        documentos: {
          'diario.txt': '19/03/2009\nJá não confio neste computador. Escondi a mensagem numa pasta oculta.\n\n20/03/2009\nPus o computador a copiar o registo do FAROL todas as noites, à meia-noite.\nSe alguém mexer na minha conta, fica lá escrito.\n',
          'contactos.txt': 'Ana (irmã) ......... ligar ao domingo\nRui (Vigia) ........ NÃO ATENDER\n'
        },
        farol: {
          'LEIA-ME.txt': 'Cópia automática do registo de acessos do servidor FAROL (10.0.0.7).\nFeita todas as noites às 00:00.\n\nauth.log = quem entrou, quem falhou a palavra-passe, quando e de onde.\n',
          'auth.log': LOG
        },
        '.segredo': {
          'mensagem.b64': 'U2UgZXN0w6FzIGEgbGVyIGlzdG8sIGNvbnNlZ3Vpc3RlLiBCb20gdHJhYmFsaG8u\n',
          'nota.txt': 'Para ler a mensagem, usa Python.\n'
        },
        '.local': { share: { Trash: { files: {} } } }
      }
    },
    etc: { hostname: 'sotao\n' },
    tmp: {}
  },

  correio: [
    { id: 'ana', de: 'Ana Reis <ana.reis@sapo.pt>', assunto: 'Domingo?', data: '15/03/2009', quando: null, lido: true,
      corpo: 'Marta,\n\nnão atendes o telefone há uma semana. A mãe está preocupada.\nVens almoçar no domingo? Diz qualquer coisa.\n\nBeijinhos,\nAna' },
    { id: 'rui2', de: 'Rui Matos <rui.matos@vigia.pt>', assunto: 'Quem é?', data: '20/03/2009', quando: null, lido: true,
      corpo: 'O computador da Marta voltou a ligar-se à rede.\n\nNão sei quem és, mas sei o que estás a ler.\nDesliga isso. Agora.\n\nR.' },
    { id: 'm', de: 'M. <anonimo@remailer.invalid>', assunto: 'Lê isto antes que ele apague tudo', data: '00:19', quando: null,
      corpo: 'Viste o FAROL. Agora sabes que eu não estava a inventar.\n\nO Rui vai apagar os registos do servidor esta noite. Mas este computador faz uma cópia todas as noites, à meia-noite: está na pasta farol, no ficheiro auth.log.\n\nAlguém entrou na conta da Marta no FAROL na madrugada de 20 de março, às 03:14. Não foi ela.\n\nDescobre de onde veio o ataque. O registo tem mais de duas mil linhas: não o leias à mão. Usa o terminal e o Python.\n\n— M.' },
    { id: 'm2', de: 'M. <anonimo@remailer.invalid>', assunto: 'Bem feito', data: 'agora', quando: 'bloqueou',
      corpo: 'Fechaste-lhe a porta. Bem feito.\n\nQueres saber de quem é o 10.0.0.66? Experimenta no terminal:\n  grep "for rui" auth.log\n\nEle conseguiu a palavra-passe da Marta à tentativa 613. Amanhã à noite explico-te como — e como é que tu te proteges.\n\n— M.' }
  ],

  passos: [
    {
      facto: 'mail:m',
      abre: 'correio',
      titulo: 'Um e-mail de “M.”',
      historia: 'O Rui expulsou-te do servidor FAROL, mas tu continuas no computador da Marta, no sótão. Perdeste o acesso ao servidor, não ao computador. E acabou de chegar um e-mail de alguém que assina só <b>“M.”</b>.' + '<div class="rede"><div class="rede-pc"><b>💻 Computador da Marta</b><span>no sótão · continuas aqui</span></div><div class="rede-seta"><code>ssh</code><span>✖ ligação cortada</span></div><div class="rede-pc srv"><b>🗄️ Servidor FAROL</b><span>noutro sítio · 10.0.0.7</span></div></div>',
      aprende: 'Quem investiga ataques informáticos chama-se <b>analista forense</b>. O primeiro passo é sempre o mesmo: perceber o que aconteceu e onde estão as provas.',
      tarefa: '<ol><li>Clica no ícone <b>Correio</b> (o envelope, a piscar) no ambiente de trabalho. No telemóvel, toca em <b>Correio</b> na barra de baixo.</li><li>Clica na mensagem de <b>M.</b> (a que tem uma bolinha azul) e lê-a.</li></ol>',
      pista: 'O Correio é o ícone do envelope branco, à esquerda. A mensagem nova está no topo da lista.'
    },
    {
      facto: 'head',
      abre: 'terminal',
      titulo: 'Espreita o registo',
      historia: 'A M. diz que há uma cópia do registo do servidor na pasta <b>farol</b>. Um <b>registo</b> (em inglês, <i>log</i>) é um ficheiro onde o servidor aponta tudo o que acontece: quem entrou, quem falhou, quando e de onde.',
      aprende: 'O ficheiro é enorme. Em vez de o despejar todo com <code>cat</code>, usa <code>head</code> (“cabeça”): mostra só as <b>primeiras 10 linhas</b>. O <code>tail</code> (“cauda”) mostra as últimas.<br>Cada linha do registo conta uma história:' +
        '<div class="anat"><code>Mar 19 08:12:44</code><span>dia e hora</span><code>farol</code><span>o servidor</span><code>sshd[1803]:</code><span>o programa que regista as entradas</span><code>Accepted password</code><span>palavra-passe <b>aceite</b> (entrou) — ou <b>Failed</b>, falhada</span><code>for joao</code><span>a conta</span><code>from 10.0.0.12</code><span>de onde veio: o <b>endereço IP</b></span></div>',
      tarefa: '<ol><li>Abre o <b>Terminal</b> (o ícone a piscar).</li><li>Entra na pasta: <code class="cmd">cd farol</code> e Enter.</li><li>Escreve <code class="cmd">head auth.log</code> e Enter.</li></ol>',
      pista: 'Primeiro <code>cd farol</code>, depois <code>head auth.log</code>. Se te enganares de pasta, <code>cd</code> sozinho volta ao início.'
    },
    {
      facto: 'wc',
      titulo: 'Quantas linhas tem?',
      historia: 'Cada linha do registo é um acontecimento. Mas quantos são, ao todo?',
      aprende: '<code>wc</code> (de <i>word count</i>, “contar palavras”) conta as linhas, as palavras e as letras de um ficheiro. Com <code>-l</code> conta só as <b>linhas</b>.',
      tarefa: 'Escreve <code class="cmd">wc -l auth.log</code> e carrega em Enter.',
      pista: 'É wc, espaço, menos, a letra <b>L</b> minúscula, espaço, auth.log. Tens de estar dentro da pasta farol (o prompt mostra <code>~/farol</code>).'
    },
    {
      facto: 'grepFailed',
      titulo: 'Procura as falhas',
      historia: `São ${LINHAS} linhas. Ler tudo à mão demorava horas. Felizmente, o terminal tem uma lupa.`,
      aprende: '<code>grep</code> procura uma palavra num ficheiro e mostra <b>só as linhas que a têm</b>.<br>Quando alguém erra a palavra-passe, o servidor escreve <b>Failed password</b>. Atenção: o grep distingue maiúsculas de minúsculas — <code>Failed</code> não é o mesmo que <code>failed</code>.',
      tarefa: '<ol><li>Escreve <code class="cmd">grep Failed auth.log</code> e carrega em Enter.</li><li>Desce até ao fim do que apareceu e lê a <b>última linha, a amarelo</b>: diz quantas falhas o grep encontrou ao todo.</li></ol>',
      pista: 'Escreve exatamente <code>grep Failed auth.log</code>, com F maiúsculo. As palavras encontradas aparecem a vermelho.'
    },
    {
      facto: 'lista',
      abre: 'python',
      licao: true,
      titulo: 'Lição: listas e repetições (for)',
      historia: 'O que acabaste de ver: o grep encontrou <b>702 falhas</b>, mas o ecrã só mostra as primeiras 60. Cada falha tem um endereço IP (o número depois de <b>from</b>), que diz <b>de que computador</b> veio a tentativa. A pergunta que interessa é: <b>há algum endereço que aparece muito mais vezes do que os outros?</b> Se houver, é provável que seja o atacante.<br><b>Se viste vários endereços a repetir-se</b> (o 192.0.2.77, o 203.0.113.9, o 198.51.100.23…), todos a tentar a conta <b>root</b>, isso é normal. Chama-se <b>ruído</b>. A <b>root</b> é a conta de administrador, a que manda em tudo, por isso é a primeira que se tenta. Há robôs na internet que passam o dia a bater à porta de todos os servidores do mundo: tentam umas dezenas de vezes e, se não entram, vão-se embora. Acontece a qualquer servidor ligado à internet.<br>O que procuras é diferente: alguém que <b>não desistiu</b>. Mas só viste 60 linhas de 702, por isso não dá para saber pelo que cabe no ecrã. É preciso contar todas.<br>Ler 702 linhas e contar à mão seria impossível. Vais pôr o Python a contar por ti. Primeiro, duas ideias que vais usar muito: <b>listas</b> e <b>for</b>.',
      aprende: 'Uma <b>lista</b> é uma caixa com várias coisas lá dentro, <b>por ordem</b>, entre parênteses retos <code>[ ]</code> e separadas por vírgulas:' +
        '<div class="caixas"><div class="caixa"><span class="etq">suspeitos</span><span class="val">["Rui", "Ana", "Pedro"]</span></div></div>' +
        '<b>for</b> quer dizer “para cada”: repete as linhas de dentro <b>uma vez para cada coisa</b> da lista. Em cada volta, a coisa da vez fica guardada numa caixa (aqui, <code>pessoa</code>).<br><br><b>Como é que o Python sabe o que repetir?</b> Pelo espaço no início da linha. Pensa numa receita:<div class="receita"><b>Para cada ovo:</b><span class="dentro">parte o ovo</span><span class="dentro">bate-o na taça</span><span>Leva ao forno.</span></div>As duas linhas encostadas para a direita fazem-se <b>uma vez por ovo</b>. “Leva ao forno” está encostada à esquerda: já não faz parte da repetição, faz-se <b>uma vez só</b>, no fim.<br>No Python é igual. As linhas que se repetem começam com <b>4 espaços</b> (aqui marcados com <span class="esp">····</span>):<div class="recuo"><div><code>for pessoa in suspeitos:</code><i>a pergunta “para cada…”</i></div><div class="rep"><code><span class="esp">····</span>print("A investigar:", pessoa)</code><i>↻ dentro: repete, uma vez por nome</i></div><div><code>print("Fim da lista.")</code><i>fora: corre uma vez só, no fim</i></div></div>Neste exercício os espaços já estão escritos: só tens de reparar neles. Quando tiveres de os escrever tu, carrega <b>4 vezes na barra de espaço</b> (ou 1 vez na tecla <kbd>Tab</kbd>). Depois de uma linha que acaba em <b>:</b>, o editor já põe os espaços sozinho quando carregas em <kbd>Enter</kbd>.',
      explicaTitulo: 'O programa, linha a linha',
      explica: [
        ['suspeitos = ["Rui", "Ana", "Pedro"]', 'Cria a caixa <b>suspeitos</b> com uma lista de 3 nomes.'],
        ['for pessoa in suspeitos:', '“Para cada <b>pessoa</b> na lista <b>suspeitos</b>…” Os dois pontos no fim dizem que vem um bloco de linhas.'],
        ['    print("A investigar:", pessoa)', 'Linha <b>de dentro</b> (4 espaços): corre uma vez por nome. De cada vez, <b>pessoa</b> tem um nome diferente.'],
        ['print("Fim da lista.")', 'Sem espaços: está <b>fora</b> do for, por isso só corre uma vez, no fim.']
      ],
      tarefa: '<ol><li>Abre o <b>Python</b> (ícone a piscar) e carrega em <b>▶ Executar</b>. Conta quantas vezes aparece “A investigar”.</li><li>Acrescenta um quarto nome à lista: logo a seguir a <code>"Pedro"</code>, escreve uma vírgula e outro nome entre aspas.</li><li>Carrega outra vez em <b>▶ Executar</b>.</li></ol>',
      antesDepois: ['suspeitos = ["Rui", "Ana", "Pedro"]', 'suspeitos = ["Rui", "Ana", "Pedro"<mark>, "Sofia"</mark>]'],
      pista: 'Clica entre a <b>"</b> final de Pedro e o <b>]</b>, e escreve <code>, "Sofia"</code> — vírgula, espaço, aspas, nome, aspas.',
      feito: 'O <b>for</b> pegou em cada nome da lista, um de cada vez, guardou-o na caixa <b>pessoa</b> e correu a linha de dentro. 4 nomes → 4 voltas. O “Fim da lista.” só apareceu uma vez, porque está fora do for.<br>Agora imagina que a lista são as linhas do registo: o for passa por todas em menos de um segundo.',
      codigo:
'# Uma lista guarda várias coisas numa só caixa, entre [ ]\n' +
'suspeitos = ["Rui", "Ana", "Pedro"]\n\n' +
'# for: repete as linhas de dentro, uma vez para cada coisa da lista\n' +
'for pessoa in suspeitos:\n' +
'    print("A investigar:", pessoa)\n\n' +
'# Esta linha está fora do for (sem espaços): só corre no fim\n' +
'print("Fim da lista.")\n',
      solucao:
'# Uma lista guarda várias coisas numa só caixa, entre [ ]\n' +
'suspeitos = ["Rui", "Ana", "Pedro", "Sofia"]\n\n' +
'# for: repete as linhas de dentro, uma vez para cada coisa da lista\n' +
'for pessoa in suspeitos:\n' +
'    print("A investigar:", pessoa)\n\n' +
'# Esta linha está fora do for (sem espaços): só corre no fim\n' +
'print("Fim da lista.")\n'
    },
    {
      facto: 'contou',
      titulo: 'Conta as falhas com um if',
      historia: 'Agora vais usar um <b>for</b> para passar pelas linhas todas do registo e contar as que têm falhas.',
      aprende: '<b>if</b> quer dizer “se”: faz uma pergunta de sim ou não. As linhas de dentro do if só correm quando a resposta é <b>sim</b>.<br><code>if "Failed" in linha:</code> pergunta: “a palavra <i>Failed</i> está dentro desta linha?”<br>Para contar, usa-se uma caixa que começa em 0 e a que se soma 1 de cada vez: <code>contador = contador + 1</code> quer dizer “pega no que está no contador, soma 1 e guarda outra vez lá”.',
      explicaTitulo: 'O programa, linha a linha',
      explica: [
        ['contador = 0', 'Cria a caixa <b>contador</b>, a começar em zero.'],
        ['with open("/home/marta/farol/auth.log") as ficheiro:', 'Abre o registo, como fizeste na missão 1.'],
        ['    for linha in ficheiro:', 'Para cada <b>linha</b> do ficheiro… (passa por todas, uma de cada vez)'],
        ['        if "???" in linha:', '…<b>se</b> a palavra entre aspas estiver nessa linha… <b>É aqui que escreves a palavra.</b>'],
        ['            contador = contador + 1', '…soma 1 ao contador. Repara nos <b>12 espaços</b>: está dentro do if, que está dentro do for, que está dentro do with.'],
        ['print("Tentativas falhadas:", contador)', 'Sem espaços: só corre no fim, e mostra o total.']
      ],
      tarefa: '<ol><li>Na janela <b>Python</b>, encontra <code>"???"</code> (a piscar).</li><li>Apaga os três <b>?</b> mas <b>deixa as aspas</b>, e escreve <b>Failed</b> — com F maiúsculo, igual ao que procuraste com o grep.</li><li>Carrega em <b>▶ Executar</b>.</li></ol>',
      antesDepois: ['if "<mark>???</mark>" in linha:', 'if "<mark>Failed</mark>" in linha:'],
      pista: 'Se der <b>0</b>, a palavra não está igual à do registo: tem de ser <code>Failed</code>, com F maiúsculo e o resto minúsculo. A linha fica: <code>if "Failed" in linha:</code>',
      feito: `O for passou pelas ${LINHAS} linhas do registo. Em cada uma, o if perguntou “tem Failed?” e, quando a resposta foi sim, somou 1 ao contador. No fim: <b>${FALHAS} tentativas falhadas</b>.<br>Já sabes <b>quantas</b>. Falta saber <b>de onde</b> vieram.`,
      codigo:
'contador = 0\n\n' +
'with open("/home/marta/farol/auth.log") as ficheiro:\n' +
'    # Para cada linha do registo...\n' +
'    for linha in ficheiro:\n' +
'        # ...se tiver a palavra que procuramos, soma 1\n' +
'        # 👉 troca ??? pela palavra que marca as falhas (deixa as aspas)\n' +
'        if "???" in linha:\n' +
'            contador = contador + 1\n\n' +
'print("Tentativas falhadas:", contador)\n',
      solucao:
'contador = 0\n\n' +
'with open("/home/marta/farol/auth.log") as ficheiro:\n' +
'    # Para cada linha do registo...\n' +
'    for linha in ficheiro:\n' +
'        # ...se tiver a palavra Failed, soma 1\n' +
'        if "Failed" in linha:\n' +
'            contador = contador + 1\n\n' +
'print("Tentativas falhadas:", contador)\n'
    },
    {
      facto: 'posicao',
      abre: 'terminal',
      licao: true,
      titulo: 'Lição: cortar uma linha em pedaços',
      historia: 'Para saber de onde veio cada falha, tens de tirar o <b>endereço IP</b> de cada linha. É como recortar uma palavra de uma frase.<br>Antes de pores o Python a fazer isto às 702 linhas, aprende com <b>uma só</b>. Vais <b>copiar uma linha de falha do Terminal e colá-la no Python</b>, como quem copia uma frase de um site para uma mensagem.',
      aprende: '<code>linha.split()</code> corta um texto <b>nos espaços</b> e devolve uma <b>lista</b> de pedaços.<br>Cada pedaço tem um número de <b>posição</b> e, atenção, <b>conta-se a partir do 0</b>, não do 1:' +
        `<div class="pecas"><span><i>0</i>${EX_P[0]}</span><span><i>1</i>${EX_P[1]}</span><span><i>2</i>${EX_P[2]}</span><span><i>3</i>${EX_P[3]}</span><span class="mais">…</span></div>` +
        `Para ir buscar um pedaço, escreve-se o nome da lista e a posição entre parênteses retos: <code>partes[0]</code> é <i>${EX_P[0]}</i>, <code>partes[1]</code> é <i>${EX_P[1]}</i>, e assim por diante.`,
      explicaTitulo: 'O programa, linha a linha',
      explica: [
        ['linha = "???"', 'A caixa <b>linha</b> vai guardar a linha que copiares do Terminal. Os <b>???</b> são o sítio onde a colas, <b>entre as aspas</b>.'],
        ['partes = linha.split()', 'Corta a linha nos espaços e guarda a lista de pedaços na caixa <b>partes</b>.'],
        ['print(partes)', 'Mostra a lista toda, para contares as posições.'],
        ['print("IP:", partes[0])', 'Mostra o pedaço da posição <b>0</b>. É este número que vais mudar.']
      ],
      tarefa: '<p><b>Parte 1: copiar uma linha do Terminal</b></p><ol>' +
        '<li>Clica em <b>Terminal</b> na barra de tarefas. As linhas do <code>grep Failed auth.log</code> ainda lá estão. Se não estiverem, escreve esse comando outra vez.</li>' +
        `<li>Escolhe uma linha com <b>Failed</b>, por exemplo a primeira: <code>${EXEMPLO.slice(0, 22)}…</code></li>` +
        '<li>Carrega com o rato <b>antes da primeira letra</b> da linha (no “Mar”) e, <b>sem largar o botão</b>, arrasta até ao fim da linha (o “ssh2”). Se a janela for estreita, a linha ocupa duas linhas no ecrã: arrasta até ao “ssh2” na mesma. O texto fica pintado.</li>' +
        '<li>Carrega em <kbd>Ctrl</kbd>+<kbd>C</kbd> para copiar. No Mac é <kbd>⌘</kbd>+<kbd>C</kbd>.</li></ol>' +
        '<p><b>Parte 2: colar no Python</b></p><ol>' +
        '<li>Abre o <b>Python</b>. Na linha 2, clica <b>logo a seguir aos ???</b> (entre o último ? e as aspas) e carrega <b>3 vezes</b> em <kbd>⌫ Backspace</kbd> para os apagar. Fica <code>linha = ""</code>, com o cursor entre as aspas.</li>' +
        '<li>Carrega em <kbd>Ctrl</kbd>+<kbd>V</kbd> para colar. Confirma que a linha ficou entre as aspas: <code>linha = "Mar …ssh2"</code>.</li>' +
        '<li>Carrega em <b>▶ Executar</b> e olha para a lista que aparece.</li>' +
        '<li>Conta os pedaços até chegares ao IP (o número a seguir a <b>from</b>), começando no <b>0</b>.</li>' +
        '<li>Na última linha, troca o <b>0</b> de <code>partes[0]</code> por esse número e executa outra vez.</li></ol>' +
        '<p>No telemóvel é difícil selecionar texto. Usa <b>✍ Escrever por mim</b>, que cola a primeira linha por ti.</p>',
      antesDepois: ['linha = "<mark>???</mark>"', `linha = "<mark>${EXEMPLO.slice(0, 30)}…</mark>"   ← a linha que colaste`],
      pista: `Se os <b>???</b> ainda lá estiverem, a lista mostra só <code>['???']</code>: ainda não colaste a linha.<br>Para contar: ${EX_P[0]} (0), ${EX_P[1]} (1), a hora (2), farol (3), sshd[…]: (4), Failed (5), password (6), for (7), o nome da conta (8), from (9)… e o IP vem logo a seguir. Se aparecer <i>IndexError</i>, o número é maior do que a lista.`,
      feito: 'O IP está na posição <b>10</b>. É o 11.º pedaço, porque se conta a partir do 0.<br>Em todas as linhas de falha do registo o IP está no mesmo sítio. Por isso, <code>linha.split()[10]</code> tira o IP de <b>qualquer</b> uma delas. É isso que vais usar a seguir, nas 702.',
      codigo:
'# 👉 Cola aqui, entre as aspas, a linha que copiaste do Terminal\n' +
'linha = "???"\n\n' +
'# split() corta o texto nos espaços e devolve uma lista de pedaços\n' +
'partes = linha.split()\n' +
'print(partes)\n\n' +
'# Cada pedaço tem uma posição. Atenção: conta-se a partir do 0!\n' +
'# 👉 troca o 0 pela posição do endereço IP\n' +
'print("IP:", partes[0])\n',
      solucao:
'# A linha copiada do Terminal (a primeira do grep Failed)\n' +
`linha = "${EXEMPLO}"\n\n` +
'# split() corta o texto nos espaços e devolve uma lista de pedaços\n' +
'partes = linha.split()\n' +
'print(partes)\n\n' +
'# O IP está na posição 10 (a 11.ª, porque se começa no 0)\n' +
'print("IP:", partes[10])\n'
    },
    {
      facto: 'top',
      titulo: 'Quem tentou mais vezes?',
      historia: 'Hora de juntar tudo o que aprendeste: o <b>for</b>, o <b>if</b> e o <b>split</b>. Mais uma ferramenta nova, para contar.',
      aprende: '<code>Counter</code> é uma ferramenta para contar coisas — como uma folha onde fazes um risco ao lado de cada nome. Vive na caixa de ferramentas <b>collections</b>.<br><code>from collections import Counter</code> quer dizer: “da caixa <i>collections</i>, traz só a ferramenta <i>Counter</i>”. Assim podes escrever só <code>Counter</code>, sem <code>collections.</code> antes.<br><code>contagem[ip] = contagem[ip] + 1</code> faz mais um risco ao lado daquele IP. No fim, <code>most_common(3)</code> dá os 3 com mais riscos.',
      explicaTitulo: 'O programa, peça a peça',
      explica: [
        ['from collections import Counter', 'Da caixa <b>collections</b>, traz a ferramenta <b>Counter</b>.'],
        ['contagem = Counter()', 'Cria uma folha de contagem vazia, na caixa <b>contagem</b>.'],
        ['        if "Failed" in linha:', 'Só as linhas de falha, como no passo anterior.'],
        ['            ip = linha.split()[???]', 'Corta a linha e tira o pedaço da posição do IP. <b>Aqui escreves a posição que descobriste.</b>'],
        ['            contagem[ip] = contagem[ip] + 1', 'Mais um risco ao lado deste IP.'],
        ['for ip, vezes in contagem.most_common(3):', 'Para cada um dos 3 IPs com mais riscos… De cada vez, o IP vai para a caixa <b>ip</b> e o número de riscos para a caixa <b>vezes</b>.'],
        ['    print(ip, "→", vezes, "tentativas")', '…mostra o IP e quantas vezes falhou.']
      ],
      tarefa: '<ol><li>Na janela <b>Python</b>, troca o <b>???</b> pela posição do IP — a que descobriste no passo anterior.</li><li>Carrega em <b>▶ Executar</b>.</li><li>Olha para o primeiro da lista.</li></ol>',
      antesDepois: ['ip = linha.split()[<mark>???</mark>]', 'ip = linha.split()[<mark>10</mark>]'],
      pista: 'A posição é <b>10</b>. A linha fica: <code>ip = linha.split()[10]</code>',
      feito: `<b>10.0.0.66</b> falhou a palavra-passe <b>${ATAQUE} vezes</b> em 23 minutos, de madrugada. Compara com os outros: os robôs do “ruído” tentaram 45, 12 e 8 vezes e desistiram. Ninguém se engana ${ATAQUE} vezes: isto é um <b>ataque de força bruta</b> — um programa a experimentar palavras-passe, uma atrás da outra, até acertar.<br>E o 10.0.0.66… já viste este endereço. Era o “último login” quando entraste no FAROL.`,
      codigo:
'# Da caixa de ferramentas collections, trazer só o Counter (serve para contar)\n' +
'from collections import Counter\n\n' +
'contagem = Counter()\n\n' +
'with open("/home/marta/farol/auth.log") as ficheiro:\n' +
'    for linha in ficheiro:\n' +
'        if "Failed" in linha:\n' +
'            # 👉 troca ??? pela posição do IP que descobriste\n' +
'            ip = linha.split()[???]\n' +
'            contagem[ip] = contagem[ip] + 1\n\n' +
'# Os 3 IPs com mais tentativas falhadas\n' +
'for ip, vezes in contagem.most_common(3):\n' +
'    print(ip, "→", vezes, "tentativas")\n',
      solucao:
'# Da caixa de ferramentas collections, trazer só o Counter (serve para contar)\n' +
'from collections import Counter\n\n' +
'contagem = Counter()\n\n' +
'with open("/home/marta/farol/auth.log") as ficheiro:\n' +
'    for linha in ficheiro:\n' +
'        if "Failed" in linha:\n' +
'            ip = linha.split()[10]\n' +
'            contagem[ip] = contagem[ip] + 1\n\n' +
'# Os 3 IPs com mais tentativas falhadas\n' +
'for ip, vezes in contagem.most_common(3):\n' +
'    print(ip, "→", vezes, "tentativas")\n'
    },
    {
      facto: 'entrou',
      abre: 'terminal',
      titulo: 'Conseguiu entrar?',
      historia: 'Um ataque de força bruta só para quando acerta — ou quando desiste. Qual das duas foi?',
      aprende: 'Quando alguém acerta na palavra-passe, o servidor escreve <b>Accepted password</b> (palavra-passe aceite).<br>O <code>grep</code> também procura <b>frases</b>: basta pô-las entre aspas.',
      tarefa: '<ol><li>Volta ao <b>Terminal</b> (barra de tarefas, em baixo).</li><li>Escreve <code class="cmd">grep "Accepted password for marta" auth.log</code> e carrega em Enter.</li><li>Olha para os endereços IP: quase todos são iguais… menos um.</li></ol>',
      pista: 'Toca no comando verde, aqui nas notas: ele vai sozinho para o terminal, com as aspas. Depois é só carregar em Enter.',
      feito: 'Quase todas as entradas da Marta vieram de <b>10.0.0.23</b> — o computador dela, este onde estás (viste esse endereço quando ele arrancou). Menos uma: <b>20 de março às 03:14:07, de 10.0.0.66</b>, logo a seguir às 612 falhas.<br>O atacante acertou na palavra-passe e entrou na conta da Marta.<br>E agora… repara no terminal. Alguém está a bater à porta.'
    },
    {
      facto: 'bloqueou',
      abre: 'terminal',
      titulo: 'Defende-te!',
      historia: 'O mesmo endereço, <b>10.0.0.66</b>, está agora a tentar entrar <b>neste computador</b> — vês as tentativas a aparecer no terminal, a vermelho. É o mesmo ataque, outra vez à conta da Marta.',
      aprende: 'Uma <b>firewall</b> é como um porteiro: decide quem pode entrar no computador pela rede. Se lhe deres o endereço do atacante, ela fecha-lhe a porta.<br>Neste computador, o comando é <code>firewall bloquear &lt;ip&gt;</code>. Num Linux a sério usarias, por exemplo, <code>sudo ufw deny from &lt;ip&gt;</code>.',
      tarefa: '<ol><li>No <b>Terminal</b>, escreve <code class="cmd">firewall bloquear 10.0.0.66</code> e carrega em Enter.</li><li>Se quiseres confirmar, <code class="cmd">firewall lista</code> mostra as regras ativas.</li></ol>',
      pista: 'Escreve: firewall, espaço, bloquear, espaço, 10.0.0.66. Os pontos do endereço contam.'
    }
  ],

  // comandos que só existem nesta missão
  comandos(api) {
    return {
      firewall(args) {
        const E = api.estado();
        const regras = E.extra.bloqueados || (E.extra.bloqueados = []);
        const [acao, ip] = args;
        if (acao === 'lista') {
          if (!regras.length) api.linha('Sem regras. Todas as ligações são aceites.', 'dim');
          else regras.forEach((r, k) => api.linha(`${k + 1}. BLOQUEAR tudo o que vem de ${r}`, 'ok'));
          return;
        }
        if (acao === 'bloquear') {
          if (!ip || !/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) return api.linha('Endereço inválido. Exemplo: firewall bloquear 10.0.0.66', 'erro');
          if (!regras.includes(ip)) regras.push(ip);
          api.gravar();
          api.linha(`✓ Regra adicionada: bloquear todas as ligações de ${ip}`, 'ok');
          if (ip === '10.0.0.66') {
            pararAtaque();
            api.linha('As tentativas pararam. O atacante já não consegue chegar a este computador.', 'ok');
            api.facto('bloqueou');
          } else if (ataque) api.linha('…mas as tentativas continuam. Esse não é o endereço do atacante.', 'warn');
          return;
        }
        if (acao === 'desbloquear') {
          E.extra.bloqueados = regras.filter(r => r !== ip); api.gravar();
          return api.linha(`Regra removida: ${ip || '?'}`, 'dim');
        }
        api.linha('Uso: firewall lista | firewall bloquear <ip> | firewall desbloquear <ip>', 'warn');
      }
    };
  },

  // ao chegar ao último passo, o ataque começa a aparecer no terminal
  aoEntrarPasso(p, api) {
    if (p.facto !== 'bloqueou' || ataque || api.estado().factos.bloqueou) return;
    api.linha('', '');
    api.linha('[!] ALERTA: muitas tentativas de login falhadas a chegar a ESTE computador!', 'erro');
    api.avisar('⚠ <b>Alerta:</b> alguém está a tentar entrar neste computador. Vê o Terminal!');
    let porta = 40211, n = 0;
    ataque = setInterval(() => {
      if (++n > 80) return pararAtaque();
      api.linha(`⚠ sotao sshd: Failed password for marta from 10.0.0.66 port ${porta++} ssh2`, 'erro');
    }, 1800);
  },

  verificarCmd(i) {
    const LOGP = '/home/marta/farol/auth.log';
    if (i.abs !== LOGP) return [];
    if (i.nome === 'head' || i.nome === 'tail') return ['head'];
    if (i.nome === 'wc') return ['wc'];
    if (i.nome === 'grep') {
      const f = [];
      if (i.linhas.some(l => l.includes('Failed password'))) f.push('grepFailed');
      if (/accepted/i.test(i.padrao) && i.linhas.some(l => l.includes('Accepted') && l.includes('10.0.0.66') && l.includes('for marta'))) f.push('entrou');
      return f;
    }
    return [];
  },

  verificarPy(out) {
    const f = [];
    if ((out.match(/A investigar:/g) || []).length >= 4) f.push('lista');
    if (out.includes('Tentativas falhadas: ' + FALHAS)) f.push('contou');
    if (/IP: \d+\.\d+\.\d+\.\d+/.test(out)) f.push('posicao');
    if (new RegExp('10\\.0\\.0\\.66 → ' + ATAQUE + ' tentativas').test(out)) f.push('top');
    return f;
  },

  fim: {
    titulo: 'Travaste o ataque.',
    aprendeste: [
      'Um <b>registo</b> (log) aponta tudo o que acontece num servidor — é a primeira prova numa investigação.',
      'No terminal: <code>head</code> e <code>tail</code> espreitam o início e o fim, <code>wc -l</code> conta linhas, e <code>grep</code> procura palavras e frases.',
      'Uma <b>lista</b> guarda várias coisas por ordem, o <b>for</b> repete para cada uma, e o <b>if</b> só faz quando a resposta é sim.',
      '<code>split()</code> corta um texto em pedaços, e as posições contam-se a partir do 0.',
      '<code>Counter</code> conta coisas, e <code>most_common</code> diz quais aparecem mais.',
      'Um <b>ataque de força bruta</b> experimenta palavras-passe às centenas — e uma <b>firewall</b> pode fechar a porta a quem ataca.'
    ],
    proximo: `Os teus programas leram ${LINHAS} linhas em menos de um segundo. É isto que um analista de segurança faz todos os dias.`,
    teaser: '<b>Missão 3 · A palavra-passe</b><br>O Rui acertou na palavra-passe da Marta à tentativa 613. Como? Vais descobrir o que é um <b>hash</b>, porque é que “123456” é uma péssima ideia, e criar uma palavra-passe que nenhum programa adivinha.<br><i>Entretanto, abre o Correio: a M. mandou-te outra mensagem.</i>'
  }
});

window.MISSOES_BREVE = [{ numero: 3, titulo: 'A palavra-passe', breve: true }];
})();
