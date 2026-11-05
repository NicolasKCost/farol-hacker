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
        '.local': { share: { Trash: { files: {
          'esconder.py':
'# apagado por marta em 20/03/2009\n' +
'import base64\n\n' +
'with open("mensagem.txt") as f:\n' +
'    texto = f.read()\n\n' +
'# codificar: texto -> bytes -> base64\n' +
'codificado = base64.b64encode(texto.encode("utf-8"))\n\n' +
'with open(".segredo/mensagem.b64", "w") as f:\n' +
'    f.write(codificado.decode())\n'
        } } } },
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

  // e-mails da Marta; "quando" = facto que faz chegar o e-mail (null = já lá estava)
  correio: [
    { id: 'ana', de: 'Ana Reis <ana.reis@sapo.pt>', assunto: 'Domingo?', data: '15/03/2009', quando: null,
      corpo: 'Marta,\n\nnão atendes o telefone há uma semana. A mãe está preocupada.\nVens almoçar no domingo? Diz qualquer coisa.\n\nBeijinhos,\nAna' },
    { id: 'rui1', de: 'Rui Matos <rui.matos@vigia.pt>', assunto: 'Registos do FAROL', data: '18/03/2009', quando: null,
      corpo: 'Marta,\n\nsoube que andaste a ver os registos do servidor FAROL fora de horas.\nIsso não é da tua conta. Os dados dos clientes estão seguros.\n\nAmanhã falamos na minha sala. Às 9h.\n\nRui Matos\nDiretor de Sistemas — Vigia Segurança, Lda.' },
    { id: 'rui2', de: 'Rui Matos <rui.matos@vigia.pt>', assunto: 'Quem é?', data: 'agora', quando: 'decoded',
      corpo: 'O computador da Marta voltou a ligar-se à rede.\n\nNão sei quem és, mas sei o que estás a ler.\nDesliga isso. Agora.\n\nR.' }
  ],

  servidor: { ip: '10.0.0.7', user: 'marta', senha: 'farol_obscuro' },

  // Cada passo fica concluído quando o "facto" acontece no jogo.
  passos: [
    {
      facto: 'help',
      titulo: 'Liga-te ao terminal',
      historia: 'O ecrã é preto, só com texto. Isto é um <b>terminal</b>: em vez de clicar em ícones, escreves comandos.',
      aprende: 'Num terminal escreves um comando e carregas em <kbd>Enter</kbd>. O comando <code>help</code> mostra o que este computador sabe fazer.',
      tarefa: 'Escreve <code class="cmd">help</code> na janela do <b>Terminal</b> e carrega em <kbd>Enter</kbd>.',
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
      facto: 'pyCorreu',
      titulo: 'Corre o teu primeiro programa',
      historia: 'A mensagem é um monte de letras sem sentido: está <b>disfarçada</b> com uma coisa chamada <b>base64</b>. A Marta apagou o comando que a lia… mas este computador tem <b>Python</b>, uma linguagem para dar ordens ao computador.',
      aprende: 'Um <b>programa</b> é uma lista de ordens que o computador cumpre de cima para baixo.<br>As linhas que começam por <code>#</code> são notas para pessoas: o computador ignora-as.<br>Este programa já está escrito: abre o ficheiro da mensagem e mostra-o no ecrã com <code>print()</code>.',
      tarefa: '<ol><li>Vai à janela <b>Python</b> (já está aberta).</li><li>Carrega no botão verde <b>▶ Executar</b>, lá em cima.</li><li>O resultado aparece na parte de baixo da janela.</li></ol>',
      pista: 'Não precisas de mudar nada no código: só carregar no botão verde <b>▶ Executar</b>. Da primeira vez pode demorar uns segundos (o Python está a ligar-se).',
      codigo:
'# Linhas que começam por # são notas: o computador ignora-as.\n\n' +
'# 1. Abrir o ficheiro da mensagem e guardar o que lá está\n' +
'#    numa "caixa" (variável) chamada codificado\n' +
'with open("/home/marta/.segredo/mensagem.b64") as ficheiro:\n' +
'    codificado = ficheiro.read()\n\n' +
'# 2. Mostrar no ecrã o que está dentro da caixa\n' +
'print(codificado)\n'
    },
    {
      facto: 'decoded',
      titulo: 'Tira o disfarce',
      historia: 'Funcionou: o programa leu a mensagem. Mas ela continua disfarçada. Vamos pedir ao Python para tirar o disfarce.',
      aprende: '<b>Base64</b> não é segredo a sério, é só um disfarce: qualquer pessoa o desfaz, sem palavra-passe.<br>O Python já traz uma ferramenta para isso, chamada <code>b64decode</code> (<i>decode</i> = descodificar).',
      tarefa: '<ol><li>Na janela <b>Python</b>, encontra a linha com <code>???</code> (tem uma 👉 por cima).</li><li>Apaga os três pontos de interrogação.</li><li>No lugar deles, escreve <code>b64decode</code></li><li>Carrega em <b>▶ Executar</b>.</li></ol>',
      pista: 'A linha tem de ficar exatamente assim:<br><code>texto = base64.b64decode(codificado).decode("utf-8")</code><br>Se não conseguires, carrega em <b>✍ Escrever por mim</b> e depois em ▶ Executar.',
      codigo:
'import base64\n\n' +
'with open("/home/marta/.segredo/mensagem.b64") as ficheiro:\n' +
'    codificado = ficheiro.read()\n\n' +
'# Tirar o disfarce.\n' +
'# 👉 Na linha de baixo, troca os 3 pontos de interrogação por b64decode\n' +
'texto = base64.???(codificado).decode("utf-8")\n\n' +
'print(texto)\n',
      solucao:
'import base64\n\n' +
'with open("/home/marta/.segredo/mensagem.b64") as ficheiro:\n' +
'    codificado = ficheiro.read()\n\n' +
'# Tirar o disfarce.\n' +
'texto = base64.b64decode(codificado).decode("utf-8")\n\n' +
'print(texto)\n'
    },
    {
      facto: 'senha',
      titulo: 'Vira a palavra-passe',
      historia: 'Conseguiste ler a mensagem! A Marta deixou uma conta aberta no servidor <b>FAROL</b>. Mas a palavra-passe está escrita ao contrário: <code>orucsbo_loraf</code>.',
      aprende: 'Em Python, <code>[::-1]</code> lê um texto de trás para a frente.<br>Exemplo: <code>"olá"[::-1]</code> dá <code>"álo"</code>.',
      tarefa: '<ol><li>Na janela <b>Python</b> há um programa novo, com a palavra-passe guardada na caixa <code>senha</code>.</li><li>Na última linha, muda <code>print(senha)</code> para <code>print(senha[::-1])</code></li><li>Carrega em <b>▶ Executar</b> e aponta a palavra que aparecer.</li></ol>',
      pista: 'Escreve <code>[::-1]</code> logo a seguir a <code>senha</code>, dentro dos parênteses: <code>print(senha[::-1])</code>. Atenção: são dois pontos, dois pontos, menos, um.',
      codigo:
'# A palavra-passe da Marta, escrita ao contrário\n' +
'senha = "orucsbo_loraf"\n\n' +
'# 👉 Muda a linha de baixo para:  print(senha[::-1])\n' +
'print(senha)\n',
      solucao:
'# A palavra-passe da Marta, escrita ao contrário\n' +
'senha = "orucsbo_loraf"\n\n' +
'# [::-1] lê o texto de trás para a frente\n' +
'print(senha[::-1])\n'
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
