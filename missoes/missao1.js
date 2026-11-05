/* Missão 1 — O computador do sótão
   Tudo aqui é ficção: ficheiros, rede e pessoas não existem. */
window.MISSAO = {
  id: 'm1',
  numero: 1,
  titulo: 'O computador do sótão',
  user: 'marta',
  host: 'sotao',
  home: '/home/marta',

  intro: [
    'Na Feira da Ladra, por 5 euros, compraste uma torre de computador cheia de pó. O vendedor disse que vinha do sótão de um prédio em Alfama.',
    'Em casa, ligas o computador. O ventilador ronca, o ecrã acende... e abre-se uma sessão de alguém chamado <b>marta</b>. O relógio está parado em março de 2009.',
    'Não precisas de saber nada de informática. Vais aprender a mexer num terminal Linux e a escrever o teu primeiro código em Python, passo a passo.'
  ],

  boot: [
    ['BIOS v1.02 · Memória: 512 MB ............ OK', 'dim'],
    ['A arrancar Linux 2.6.28 ...', 'dim'],
    ['[ OK ] Disco /dev/sda1 montado', 'ok'],
    ['[ OK ] Rede: eth0 ligada (10.0.0.23)', 'ok'],
    ['[ !! ] Relógio do sistema: sex 20 mar 2009 23:58', 'warn'],
    ['sotao login: marta (sessão automática)', 'dim'],
    ['', ''],
    ['Escreve os comandos aqui em baixo e carrega em Enter.', 'info']
  ],

  // Diretorias são objetos, ficheiros são texto.
  fs: {
    home: {
      marta: {
        'LEIA-ME.txt':
'Este computador pertence a Marta Reis.\n' +
'Se o encontraste, por favor não o formates.\n' +
'Há aqui coisas que alguém tem de ver.\n\n' +
'Começa pela pasta "documentos".\n',
        documentos: {
          'diario.txt':
'12/03/2009\n' +
'Voltei a ver os registos do servidor. Alguém da Vigia entra lá\n' +
'todas as madrugadas e copia os dados dos clientes. Ninguém acredita em mim.\n\n' +
'19/03/2009\n' +
'Já não confio neste computador. Escondi a mensagem num sítio onde\n' +
'ninguém olha: as pastas cujo nome começa por um ponto (.) não aparecem\n' +
'com um simples "ls". Só aparecem com "ls -a".\n\n' +
'20/03/2009\n' +
'Codifiquei a mensagem em base64. Não é segurança a sério — qualquer\n' +
'pessoa com Python a lê em segundos — mas engana quem só espreita.\n',
          'compras.txt': 'pão\nleite\ncafé (muito café)\ndisco rígido de 80 GB\n',
          'contactos.txt': 'Ana (irmã) ......... ligar ao domingo\nRui (Vigia) ........ NÃO ATENDER\n'
        },
        fotos: {
          'ferias_2008.jpg': '\u0000BINARIO'
        },
        '.segredo': {
          'mensagem.b64':
'U2UgZXN0w6FzIGEgbGVyIGlzdG8sIGNvbnNlZ3Vpc3RlLiBCb20gdHJhYmFsaG8u\n' +
'CgpBIFZpZ2lhIGFuZGEgYSByb3ViYXIgZGFkb3MgZG9zIGNsaWVudGVzIGF0cmF2\n' +
'w6lzIGRvIHNlcnZpZG9yIEZBUk9MLgpEZWl4ZWkgbMOhIHVtYSBjb250YSBhYmVy\n' +
'dGEgcGFyYSBxdWVtIHF1aXNlciBwcm92YXIuCgogIHNlcnZpZG9yOiAgICAgIDEw\n' +
'LjAuMC43CiAgdXRpbGl6YWRvcjogICAgbWFydGEKICBwYWxhdnJhLXBhc3NlOiBv\n' +
'cnVjc2JvX2xvcmFmICAgKGVzY3JpdGEgYW8gY29udHLDoXJpbyEpCgpWaXJhIGEg\n' +
'cGFsYXZyYS1wYXNzZSBjb20gUHl0aG9uIGUgZW50cmEgY29tOgogIHNzaCBtYXJ0\n' +
'YUAxMC4wLjAuNwoKQXBhZ2EgaXN0byBkZXBvaXMgZGUgbGVyLgrigJQgTS4K\n',
          'nota.txt': 'Desinstalei o comando base64 deste computador.\nPara ler a mensagem, vais ter de usar Python.\n'
        },
        '.bash_history':
'ls\ncd documentos\nnano diario.txt\nmkdir ~/.segredo\npython3 esconder.py\nrm esconder.py\nsudo apt remove base64\nhistory -c\n'
      }
    },
    etc: {
      hostname: 'sotao\n',
      passwd: 'root:x:0:0:root:/root:/bin/bash\nmarta:x:1000:1000:Marta Reis:/home/marta:/bin/bash\n'
    },
    tmp: {}
  },

  servidor: { ip: '10.0.0.7', user: 'marta', senha: 'farol_obscuro' },

  // Cada passo fica concluído quando o "facto" acontece no jogo.
  passos: [
    {
      facto: 'help',
      titulo: 'Liga-te ao terminal',
      historia: 'O ecrã é preto, só com texto. Isto é um <b>terminal</b>: em vez de clicar em ícones, escreves comandos.',
      aprende: 'Num terminal escreves um comando e carregas em <kbd>Enter</kbd>. O comando <code>help</code> mostra o que este computador sabe fazer.',
      tarefa: 'Escreve <code class="cmd">help</code> no terminal (a janela preta de cima) e carrega em <kbd>Enter</kbd>.',
      pista: 'Toca no terminal, escreve as quatro letras h-e-l-p e carrega em Enter. Também podes tocar nos comandos com fundo verde para os escrever automaticamente.'
    },
    {
      facto: 'ls',
      titulo: 'Olha à tua volta',
      historia: 'Estás dentro da pasta pessoal da Marta. Mas o que é que ela lá guardou?',
      aprende: '<code>ls</code> (de <i>list</i>) mostra os ficheiros e pastas onde estás. As pastas aparecem a azul, terminadas em <code>/</code>.',
      tarefa: 'Escreve <code class="cmd">ls</code> para listar o conteúdo da pasta.',
      pista: 'Só as letras L e S, minúsculas: <code>ls</code>.'
    },
    {
      facto: 'leia',
      titulo: 'Lê o bilhete',
      historia: 'Há um ficheiro chamado <b>LEIA-ME.txt</b>. Parece que a Marta deixou um recado a quem encontrasse o computador.',
      aprende: '<code>cat</code> mostra o conteúdo de um ficheiro de texto. Atenção: no Linux, maiúsculas e minúsculas contam. Dica: escreve o início do nome e carrega em <kbd>Tab</kbd> para completar.',
      tarefa: 'Escreve <code class="cmd">cat LEIA-ME.txt</code>.',
      pista: 'Escreve <code>cat LEIA-ME.txt</code> exatamente assim, com o nome do ficheiro em maiúsculas.'
    },
    {
      facto: 'diario',
      titulo: 'Abre os documentos',
      historia: 'O bilhete manda começar pela pasta <b>documentos</b>. Lá dentro deve haver mais pistas.',
      aprende: '<code>cd</code> (de <i>change directory</i>) entra numa pasta. <code>cd ..</code> volta para a pasta de cima. <code>pwd</code> diz onde estás.',
      tarefa: 'Entra na pasta com <code class="cmd">cd documentos</code>, vê o que lá está com <code class="cmd">ls</code> e lê o diário da Marta.',
      pista: 'Depois de <code>cd documentos</code> e <code>ls</code>, vais ver o ficheiro <b>diario.txt</b>. Lê-o com <code>cat diario.txt</code>.'
    },
    {
      facto: 'b64',
      titulo: 'A pasta escondida',
      historia: 'O diário fala de uma mensagem escondida numa pasta "onde ninguém olha". Volta à pasta da Marta e procura melhor.',
      aprende: 'No Linux, ficheiros e pastas cujo nome começa por um ponto ficam <b>ocultos</b>. O <code>ls</code> esconde-os, mas <code>ls -a</code> (de <i>all</i>) mostra tudo. <code>cd</code> sem nada volta à pasta pessoal.',
      tarefa: 'Volta com <code class="cmd">cd ..</code>, procura com <code class="cmd">ls -a</code> e lê a mensagem que está dentro da pasta escondida.',
      pista: 'Vais encontrar a pasta <b>.segredo</b> (com o ponto). Entra com <code>cd .segredo</code>, faz <code>ls</code> e depois <code>cat mensagem.b64</code>.'
    },
    {
      facto: 'decoded',
      titulo: 'Python ao resgate',
      historia: 'A mensagem é um amontoado de letras sem sentido: está em <b>base64</b>. E a Marta desinstalou o comando que a lia. Mas este computador tem Python...',
      aprende: '<b>Base64</b> transforma qualquer dado em letras e números "seguros" para enviar. <b>Não é cifra</b>: não tem chave, qualquer pessoa desfaz. Em Python, o módulo <code>base64</code> faz isso com <code>base64.b64decode()</code>.<br><br>O código no editor <b>Python</b> abre o ficheiro e guarda o texto numa <b>variável</b> (<code>codificado</code>). Falta-lhe uma palavra.',
      tarefa: 'No editor Python, troca o <code>???</code> pelo nome certo da função e carrega em <b>▶ Executar</b>.',
      pista: 'A função chama-se <code>b64decode</code>. A linha fica: <code>texto = base64.b64decode(codificado).decode("utf-8")</code>',
      codigo:
'import base64\n\n' +
'# 1. Abrir o ficheiro escondido e guardar o conteúdo numa variável\n' +
'with open("/home/marta/.segredo/mensagem.b64") as ficheiro:\n' +
'    codificado = ficheiro.read()\n\n' +
'# 2. Descodificar: base64 -> bytes -> texto\n' +
'#    Troca os pontos de interrogação pelo nome da função que DEScodifica\n' +
'texto = base64.???(codificado).decode("utf-8")\n\n' +
'print(texto)\n'
    },
    {
      facto: 'senha',
      titulo: 'Vira a palavra-passe',
      historia: 'Conseguiste! A Marta deixou uma conta aberta no servidor <b>FAROL</b>. Mas a palavra-passe está escrita ao contrário: <code>orucsbo_loraf</code>.',
      aprende: 'Em Python, um texto (<i>string</i>) é uma sequência de letras. <code>texto[::-1]</code> percorre-o do fim para o início, ou seja, vira-o ao contrário.<br><br>Experimenta: <code>print("olá"[::-1])</code> mostra <code>álo</code>.',
      tarefa: 'Escreve no editor um programa que guarde <code>"orucsbo_loraf"</code> numa variável e mostre (<code>print</code>) a palavra virada. Depois executa.',
      pista: 'Podes apagar tudo no editor e escrever só:<br><code>senha = "orucsbo_loraf"</code><br><code>print(senha[::-1])</code>'
    },
    {
      facto: 'ssh',
      titulo: 'Entra no FAROL',
      historia: 'Tens o endereço, o utilizador e a palavra-passe. Hora de ver o que a Vigia anda a esconder.',
      aprende: '<code>ssh</code> (de <i>secure shell</i>) liga-te a outro computador pela rede, para lhe dares comandos à distância. O formato é <code>ssh utilizador@endereço</code>.',
      tarefa: 'No terminal, escreve <code class="cmd">ssh marta@10.0.0.7</code> e, quando pedir, a palavra-passe que descobriste.',
      pista: 'A palavra-passe é o que o Python mostrou: <code>farol_obscuro</code>. Ao escrevê-la, não aparecem letras no ecrã — é normal, é para ninguém a ver por cima do teu ombro.'
    }
  ],

  fim: {
    aprendeste: [
      'Usar um terminal Linux: <code>ls</code>, <code>ls -a</code>, <code>cd</code>, <code>cat</code>, <code>pwd</code>',
      'Que ficheiros com ponto ficam ocultos (e que isso não é proteção)',
      'Que base64 é só uma codificação, não uma cifra',
      'Python: <code>import</code>, variáveis, abrir ficheiros, <code>print</code> e <code>[::-1]</code>',
      'Para que serve o <code>ssh</code>'
    ],
    teaser: '<b>Missão 2 · O Vigia</b><br>O Rui sabe que entraste. Tens um registo com milhares de ligações ao FAROL e alguém está a apagar provas. Vais escrever um script Python que encontra, no meio do ruído, o IP do invasor — antes que ele te encontre a ti.'
  }
};
