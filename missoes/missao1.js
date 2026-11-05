/* Missão 1 — O computador do sótão
   Tudo aqui é ficção: ficheiros, rede e pessoas não existem. */
(window.MISSOES = window.MISSOES || []).push({
  id: 'm1',
  numero: 1,
  titulo: 'O computador do sótão',
  duracao: '~15 minutos',
  relogio: [2009, 2, 20, 23, 58],
  dataTxt: 'sex 20 mar 2009 23:58:12 WET',
  user: 'marta',
  host: 'sotao',
  home: '/home/marta',

  notas: {
    ficheiro: 'para_quem_encontrar.txt',
    carta: '<p>Se estás a ler isto, alguém voltou a ligar o computador da Marta. Ela já não está cá para o fazer.</p>' +
      '<p>Não sei quem és, nem quanto sabes de computadores. Por isso vou ensinar-te tudo desde o início: como mexer no terminal, como ler os ficheiros dela e como pôr o Python a trabalhar por ti.</p>' +
      '<p>A Marta descobriu uma coisa sobre o servidor <b>FAROL</b> e sobre a empresa onde trabalhava, a <b>Vigia</b>. Preciso que alguém acabe o que ela começou.</p>' +
      '<p>Deixei-te os passos aqui em baixo. Faz um de cada vez: quando acabares um, o seguinte abre-se.</p>' +
      '<p class="assina">— M.</p>'
  },

  intro: [
    'Na Feira da Ladra, por 5 euros, compraste uma torre de computador cheia de pó. O vendedor disse que vinha do sótão de um prédio em Alfama.',
    'Em casa, ligas o computador. O ventilador ronca, o ecrã acende... e abre-se uma sessão de alguém chamado <b>marta</b>. O relógio está parado em março de 2009.',
    'No meio do ecrã, um ficheiro de texto abre-se sozinho. Chama-se <b>para_quem_encontrar.txt</b>.',
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
      abre: 'terminal',
      titulo: 'Liga-te ao terminal',
      historia: 'O ecrã é preto, só com texto. Isto é um <b>terminal</b>: em vez de clicar em ícones, escreves comandos.',
      aprende: 'Num terminal escreves um comando e carregas em <kbd>Enter</kbd>. O comando <code>help</code> mostra o que este computador sabe fazer.',
      tarefa: '<ol><li><b>Abre o Terminal:</b> no ambiente de trabalho, à esquerda, clica no ícone <b>Terminal</b> (o ecrã preto com <b>&gt;_</b>, a piscar). No telemóvel, toca em <b>Terminal</b> na barra de baixo.</li><li>Abre-se uma janela preta. Clica dentro dela, na linha que acaba em <b>$</b>.</li><li>Escreve <b>help</b> e carrega na tecla <kbd>Enter</kbd> (ou no botão <b>Enter ↵</b>).</li></ol>',
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
      facto: 'variavel',
      abre: 'python',
      feito: 'Criaste duas caixas: <b>nome</b>, com o teu nome, e <b>ano</b>, com 2009. O <code>print</code> foi buscar o que estava dentro de cada caixa e mostrou-o no ecrã. Vê na janela Python, em <b>📦 Caixas na memória</b>, as duas caixas e o que têm dentro.<br>Quando mudaste o nome, o programa mostrou o nome novo: <b>a caixa guarda o que lá puseres</b>.',
      licao: true,
      titulo: 'Lição: caixas com nome (variáveis)',
      historia: 'A mensagem está disfarçada com <b>base64</b>, e a Marta apagou o comando que a lia. Vais ter de usar <b>Python</b>, uma linguagem para dar ordens ao computador. Primeiro, a ideia mais importante da programação: as <b>variáveis</b>.',
      aprende: 'Uma <b>variável</b> é uma <b>caixa com uma etiqueta</b>. Guardas lá uma coisa e, mais tarde, chamas a caixa pelo nome para a ir buscar.' +
        '<div class="caixas"><div class="caixa"><span class="etq">nome</span><span class="val">"Marta"</span></div><div class="caixa"><span class="etq">ano</span><span class="val">2009</span></div></div>' +
        'Em Python, uma caixa cria-se com o sinal <b>=</b>: à esquerda fica a etiqueta, à direita o que vai lá para dentro.<br><code>nome = "Marta"</code> lê-se: “guarda <i>Marta</i> na caixa <i>nome</i>”.<br>O texto vai sempre <b>entre aspas</b>; os números não.',
      explicaTitulo: 'O programa, linha a linha',
      explica: [
        ['nome = "Marta"', 'Cria a caixa <b>nome</b> e guarda lá o texto <b>Marta</b>.'],
        ['ano = 2009', 'Cria a caixa <b>ano</b> e guarda lá o número <b>2009</b> (sem aspas, porque é um número).'],
        ['print(nome)', '<b>print</b> é uma <b>função</b> (uma ação): mostra no ecrã o que está <b>dentro</b> da caixa <b>nome</b>. Repara: sem aspas! <code>print("nome")</code> mostraria só a palavra “nome”.']
      ],
      tarefa: '<ol><li><b>Abre o Python:</b> no ambiente de trabalho, clica no ícone <b>Python</b> (a cobra azul e amarela, a piscar). No telemóvel, toca em <b>Python</b> na barra de baixo.</li><li>Carrega no botão verde <b>▶ Executar</b>. Em baixo aparece o resultado e a lista <b>📦 Caixas na memória</b>.</li><li>Na linha <code>nome = "Marta"</code>, apaga só as letras de <b>Marta</b> (deixa as aspas) e escreve o <b>teu nome</b>.</li><li>Carrega outra vez em <b>▶ Executar</b>.</li></ol>',
      antesDepois: ['nome = "<mark>Marta</mark>"', 'nome = "<mark>Rita</mark>"   (o teu nome)'],
      pista: 'Clica logo a seguir ao <b>a</b> final de Marta, carrega 5 vezes em <kbd>⌫</kbd> e escreve o teu nome. As aspas <b>"</b> têm de ficar dos dois lados: <code>nome = "Rita"</code>.',
      codigo:
'# Criar duas caixas (variáveis) e guardar coisas lá dentro\n' +
'nome = "Marta"\n' +
'ano = 2009\n\n' +
'# Mostrar no ecrã o que está dentro de cada caixa\n' +
'print(nome)\n' +
'print(ano)\n',
      solucao:
'# Criar duas caixas (variáveis) e guardar coisas lá dentro\n' +
'nome = "Jogador"\n' +
'ano = 2009\n\n' +
'# Mostrar no ecrã o que está dentro de cada caixa\n' +
'print(nome)\n' +
'print(ano)\n'
    },
    {
      facto: 'pyCorreu',
      feito: 'O programa abriu o ficheiro <b>mensagem.b64</b>, leu-o todo e guardou-o na caixa <b>codificado</b> (está nas 📦 Caixas na memória). Depois o <code>print</code> mostrou-o no ecrã: é a mesma sopa de letras que viste com o <code>cat</code> no terminal.<br>Agora o Python já tem a mensagem numa caixa. Falta tirar-lhe o disfarce.',
      titulo: 'Guarda a mensagem numa caixa',
      historia: 'Agora que sabes o que é uma caixa, vais guardar numa delas a mensagem disfarçada da Marta.',
      aprende: 'Este programa usa a função <b>open</b> para abrir o ficheiro da mensagem e guarda o que lá está numa caixa chamada <b>codificado</b>.<br>As linhas que começam por <code>#</code> são <b>notas</b> para pessoas: o computador salta-as.',
      explicaTitulo: 'O programa, linha a linha',
      explica: [
        ['with open("/home/marta/.segredo/mensagem.b64") as ficheiro:', '<b>open</b> abre o ficheiro cujo caminho está entre aspas. Enquanto está aberto, chamamos-lhe <b>ficheiro</b>. Os <b>dois pontos</b> no fim dizem: “o que vem a seguir acontece com o ficheiro aberto”.'],
        ['    codificado = ficheiro.read()', 'Os <b>4 espaços</b> no início mostram que esta linha pertence ao <b>with</b>. <b>read</b> lê tudo o que está no ficheiro, e o <b>=</b> guarda isso na caixa <b>codificado</b>.'],
        ['print(codificado)', 'Mostra no ecrã o que está na caixa <b>codificado</b>.']
      ],
      tarefa: '<ol><li>O programa novo já está escrito na janela <b>Python</b>: não precisas de mudar nada.</li><li>Carrega em <b>▶ Executar</b>.</li><li>Em baixo vês a mensagem disfarçada, e nas <b>📦 Caixas na memória</b> aparece a caixa <b>codificado</b>.</li></ol>',
      pista: 'Só tens de carregar no botão verde <b>▶ Executar</b>, no topo da janela Python.',
      codigo:
'# Abrir o ficheiro da mensagem e guardar o que lá está\n' +
'# numa caixa (variável) chamada codificado\n' +
'with open("/home/marta/.segredo/mensagem.b64") as ficheiro:\n' +
'    codificado = ficheiro.read()\n\n' +
'# Mostrar no ecrã o que está dentro da caixa\n' +
'print(codificado)\n'
    },
    {
      facto: 'importou',
      feito: 'O <code>import random</code> foi buscar a caixa de ferramentas <b>random</b> — aparece com 🧰 nas Caixas na memória. A ferramenta <b>randint</b> escolheu um número ao calhas entre 1 e 100, e o <code>=</code> guardou-o na caixa <b>dado</b>.<br>Para tirar o disfarce vais fazer igual, mas com outra caixa de ferramentas: a <b>base64</b>.',
      licao: true,
      titulo: 'Lição: caixas de ferramentas (import)',
      historia: 'Para tirar o disfarce vais precisar de uma ferramenta. O Python já traz centenas delas, arrumadas em <b>caixas de ferramentas</b>. Primeiro, experimenta usar uma.',
      aprende: 'O Python vem com muitas <b>caixas de ferramentas</b> (chamam-se <b>módulos</b>) guardadas num armário. Para usar uma, primeiro tens de a ir buscar com <b>import</b>.' +
        '<div class="caixas"><div class="caixa ferr"><span class="etq">🧰 random</span><span class="val">randint · choice · shuffle …</span></div><div class="caixa ferr"><span class="etq">🧰 base64</span><span class="val">b64encode · b64decode …</span></div></div>' +
        '<code>import random</code> = “vai ao armário buscar a caixa <i>random</i>” (ferramentas de sorte e acaso).<br>Depois usas uma ferramenta lá de dentro escrevendo <b>caixa.ferramenta</b>, com um <b>ponto</b> no meio: <code>random.randint(1, 6)</code> = “da caixa random, usa a ferramenta randint”. Esta escolhe um número ao calhas entre 1 e 6, como um dado.<br>Sem o <code>import</code>, o Python diz que não conhece <code>random</code>.',
      explicaTitulo: 'O programa, peça a peça',
      explica: [
        ['import random', 'Vai buscar a caixa de ferramentas <b>random</b>.'],
        ['dado =', 'Cria uma caixa chamada <b>dado</b> para guardar o número que sair.'],
        ['random.', 'Abre a caixa de ferramentas <b>random</b>…'],
        ['randint(1, 6)', '…e usa a ferramenta <b>randint</b>. O que está dentro dos parênteses é o que entregas à ferramenta: o número mínimo (<b>1</b>) e o máximo (<b>6</b>).'],
        ['print("Saiu o número", dado)', 'Mostra um texto e, a seguir, o que está na caixa <b>dado</b>. As duas coisas separam-se com uma vírgula.']
      ],
      tarefa: '<ol><li>Carrega em <b>▶ Executar</b> duas ou três vezes: sai um número diferente de cada vez.</li><li>Agora faz um dado de 100 faces: na linha do <b>randint</b>, troca o <b>6</b> por <b>100</b>.</li><li>Carrega em <b>▶ Executar</b>.</li></ol>',
      antesDepois: ['dado = random.randint(1, <mark>6</mark>)', 'dado = random.randint(1, <mark>100</mark>)'],
      pista: 'Clica logo a seguir ao <b>6</b>, apaga-o com <kbd>⌫</kbd> e escreve <b>100</b>. A linha fica: <code>dado = random.randint(1, 100)</code>',
      codigo:
'# Ir buscar ao armário a caixa de ferramentas "random" (sorte e acaso)\n' +
'import random\n\n' +
'# Da caixa random, usar a ferramenta randint:\n' +
'# escolhe um número ao calhas entre 1 e 6, como um dado\n' +
'dado = random.randint(1, 6)\n\n' +
'print("Saiu o número", dado)\n',
      solucao:
'# Ir buscar ao armário a caixa de ferramentas "random" (sorte e acaso)\n' +
'import random\n\n' +
'# Um dado de 100 faces\n' +
'dado = random.randint(1, 100)\n\n' +
'print("Saiu o número", dado)\n'
    },
    {
      facto: 'decoded',
      feito: 'A ferramenta <b>b64decode</b> tirou o disfarce, o <b>.decode("utf-8")</b> transformou o resultado em letras, e o <code>print</code> mostrou a caixa <b>texto</b>.<br><b>Lê a mensagem da Marta na janela Python:</b> tem o endereço do servidor, o utilizador e uma palavra-passe… escrita ao contrário.',
      titulo: 'Tira o disfarce',
      historia: 'Já tens tudo o que precisas: sabes guardar coisas em caixas e usar ferramentas. Agora vais mudar <b>uma única palavra</b> para o Python tirar o disfarce à mensagem.',
      aprende: '<b>Base64</b> não é um segredo a sério, é só um disfarce: qualquer pessoa o tira, sem palavra-passe.<br>A caixa de ferramentas é a <b>base64</b> (vem com <code>import base64</code>) e a ferramenta que tira o disfarce chama-se <b>b64decode</b> (<i>decode</i> = descodificar).<br><br>A linha nova parece comprida, mas o Python lê-a por partes, <b>da esquerda para a direita</b>: primeiro usa a ferramenta, depois traduz o resultado, e no fim guarda tudo na caixa <b>texto</b>.',
      explicaTitulo: 'A linha que vais completar, peça a peça',
      explica: [
        ['import base64', 'Vai buscar a caixa de ferramentas <b>base64</b> — tal como fizeste com a <b>random</b>.'],
        ['texto =', 'Cria uma caixa chamada <b>texto</b>, para guardar a mensagem já sem disfarce.'],
        ['base64.', 'Abre a caixa de ferramentas <b>base64</b>. Já está escrito: não mexas.'],
        ['???', '<b>Falta o nome da ferramenta.</b> É aqui que escreves <b>b64decode</b>.'],
        ['(codificado)', 'Entrega à ferramenta a mensagem disfarçada, que está na caixa <b>codificado</b> (guardaste-a lá dois passos atrás).'],
        ['.decode("utf-8")', 'O b64decode devolve <b>bytes</b>: os números que o computador usa por dentro para guardar letras. O <b>.decode("utf-8")</b> traduz esses números de volta para letras que se leem. <i>utf-8</i> é o “alfabeto” que inclui os acentos (á, ç, ã).'],
        ['print(texto)', 'Mostra a mensagem, finalmente sem disfarce.']
      ],
      tarefa: '<ol><li>Na janela <b>Python</b>, procura a linha com <span class="falta">???</span> (está a piscar a amarelo).</li><li>Clica logo a seguir ao último <b>?</b> — entre o <b>?</b> e o <b>(</b>.</li><li>Carrega <b>3 vezes</b> na tecla <kbd>⌫</kbd> (Backspace, a tecla de apagar) para apagar os três <b>?</b>.</li><li>Escreve <b>b64decode</b> — só isso. O <b>base64.</b> antes já lá está, não o escrevas outra vez.</li><li>Carrega em <b>▶ Executar</b>.</li></ol>',
      antesDepois: ['texto = base64.<mark>???</mark>(codificado).decode("utf-8")', 'texto = base64.<mark>b64decode</mark>(codificado).decode("utf-8")'],
      pista: 'O engano mais comum é escrever <code>base64.base64decode</code>. O nome da ferramenta é <b>b64decode</b> (começa por <b>b64</b>). A linha completa fica:<br><code>texto = base64.b64decode(codificado).decode("utf-8")</code><br>Se aparecer um erro, carrega no botão <b>✍ Corrigir por mim</b> e compara o antes e o depois.',
      codigo:
'import base64\n\n' +
'with open("/home/marta/.segredo/mensagem.b64") as ficheiro:\n' +
'    codificado = ficheiro.read()\n\n' +
'# Tirar o disfarce.\n' +
'# 👉 Na linha de baixo, troca os pontos de interrogação por b64decode\n' +
'texto = base64.???(codificado).decode("utf-8")\n\n' +
'print(texto)\n',
      solucao:
'import base64\n\n' +
'with open("/home/marta/.segredo/mensagem.b64") as ficheiro:\n' +
'    codificado = ficheiro.read()\n\n' +
'# Tirar o disfarce com a ferramenta b64decode da caixa base64\n' +
'texto = base64.b64decode(codificado).decode("utf-8")\n\n' +
'print(texto)\n'
    },
    {
      facto: 'senha',
      feito: 'O <code>[::-1]</code> leu a palavra do fim para o início: <b>orucsbo_loraf</b> virou <b>farol_obscuro</b>.<br>Aponta-a: é a palavra-passe do servidor FAROL.',
      titulo: 'Vira a palavra-passe',
      historia: 'Conseguiste ler a mensagem! A Marta deixou uma conta aberta no servidor <b>FAROL</b>. Mas a palavra-passe está escrita ao contrário: <code>orucsbo_loraf</code>.',
      aprende: 'Para o Python, um texto é uma <b>fila de letras</b>. Os parênteses retos <code>[ ]</code> servem para escolher letras dessa fila.<br><code>[::-1]</code> quer dizer: “todas as letras, do fim para o início”. Ou seja, vira o texto ao contrário.<br>Exemplo: <code>"olá"[::-1]</code> dá <code>"álo"</code>.',
      explicaTitulo: 'O programa novo, linha a linha',
      explica: [
        ['senha = "orucsbo_loraf"', 'Guarda o <b>texto</b> (o que está entre aspas) numa caixa chamada <b>senha</b>.'],
        ['print(senha)', 'Mostra a senha tal como está — ainda ao contrário.'],
        ['print(senha[::-1])', 'Mostra a senha <b>virada</b>. É assim que a última linha tem de ficar.']
      ],
      tarefa: '<ol><li>Na janela <b>Python</b> há agora um programa novo e curto.</li><li>Na última linha, clica logo a seguir à palavra <b>senha</b> — antes do <b>)</b>.</li><li>Escreve <b>[::-1]</b>: parêntese reto, dois pontos, dois pontos, menos, um, parêntese reto.</li><li>Carrega em <b>▶ Executar</b>. A palavra que aparecer é a palavra-passe: aponta-a!</li></ol>',
      antesDepois: ['print(senha)', 'print(senha<mark>[::-1]</mark>)'],
      pista: 'A última linha tem de ficar exatamente: <code>print(senha[::-1])</code><br>No teclado do computador (português), os parênteses retos fazem-se com <kbd>AltGr</kbd> + <kbd>8</kbd> e <kbd>AltGr</kbd> + <kbd>9</kbd>. No telemóvel, estão no teclado de símbolos (<b>?123</b>).',
      codigo:
'# A palavra-passe da Marta, escrita ao contrário\n' +
'senha = "orucsbo_loraf"\n\n' +
'# 👉 Muda a linha de baixo para:  print(senha[::-1])\n' +
'print(senha)\n',
      solucao:
'# A palavra-passe da Marta, escrita ao contrário\n' +
'senha = "orucsbo_loraf"\n\n' +
'# [::-1] lê o texto do fim para o início\n' +
'print(senha[::-1])\n'
    },
    {
      facto: 'ssh',
      abre: 'terminal',
      titulo: 'Entra no FAROL',
      historia: 'Tens o endereço, o utilizador e a palavra-passe. Atenção: o FAROL <b>não</b> é este computador. É um <b>servidor</b> que está noutro sítio, no endereço 10.0.0.7. O computador da Marta é só a tua porta de entrada. Hora de ver o que a Vigia anda a esconder.',
      aprende: '<code>ssh</code> (de <i>secure shell</i>) liga-te a outro computador pela rede, para lhe dares comandos à distância. O formato é <code>ssh utilizador@endereço</code>.<div class="rede"><div class="rede-pc"><b>💻 Computador da Marta</b><span>no sótão · estás aqui</span></div><div class="rede-seta"><code>ssh</code><span>▼ pela rede</span></div><div class="rede-pc srv"><b>🗄️ Servidor FAROL</b><span>noutro sítio · 10.0.0.7</span></div></div>',
      tarefa: '<ol><li><b>Volta ao Terminal:</b> clica em <b>Terminal</b> na barra de tarefas, lá em baixo (ou no ícone do ambiente de trabalho).</li><li>Escreve <code class="cmd">ssh marta@10.0.0.7</code> e carrega em <kbd>Enter</kbd>.</li><li>Quando pedir a palavra-passe, escreve a que descobriste e carrega em <kbd>Enter</kbd>. As letras não aparecem enquanto escreves — é normal, é para ninguém as ver.</li></ol>',
      pista: 'A palavra-passe é o que o Python mostrou: <code>farol_obscuro</code>. Ao escrevê-la, não aparecem letras no ecrã — é normal, é para ninguém a ver por cima do teu ombro.'
    }
  ],

  fim: {
    titulo: 'Entraste no FAROL.',
    aprendeste: [
      'No terminal: <code>ls</code> lista o que há numa pasta, <code>ls -a</code> mostra também os ocultos, <code>cd</code> entra numa pasta e <code>cat</code> lê um ficheiro.',
      'Um ficheiro oculto (com ponto no início do nome) não está protegido: só não aparece à primeira.',
      'Base64 é um disfarce, não um segredo: qualquer pessoa o desfaz, sem palavra-passe.',
      'Correste o teu primeiro programa em Python e mudaste-lhe uma linha.',
      'Uma <b>variável</b> é uma caixa com nome: <code>senha = "orucsbo_loraf"</code>. E <code>print()</code> mostra o que está lá dentro.',
      '<code>import</code> vai buscar uma caixa de ferramentas, e usa-se assim: <code>base64.b64decode</code>.',
      '<code>[::-1]</code> vira um texto ao contrário.',
      '<code>ssh</code> serve para entrar noutro computador pela rede.'
    ],
    proximo: 'Até agora usaste e mudaste programas que já estavam escritos. Na missão 2 vais escrever um tu, do zero.',
    teaser: '<b>Missão 2 · O Vigia</b><br>O Rui sabe que entraste. Tens um registo com milhares de ligações ao FAROL e alguém está a apagar provas. Vais escrever um script Python que encontra, no meio do ruído, o IP do invasor — antes que ele te encontre a ti.'
  }

  ,
  // que comandos do terminal contam como passos
  verificarCmd(i) {
    if (i.nome !== 'cat') return [];
    return ({
      '/home/marta/LEIA-ME.txt': ['leia'],
      '/home/marta/documentos/diario.txt': ['diario'],
      '/home/marta/.segredo/mensagem.b64': ['b64']
    })[i.abs] || [];
  },
  // que resultados do Python contam como passos
  verificarPy(out, src) {
    const f = [];
    const nm = src.match(/^\s*nome\s*=\s*["']([^"'\n]+)["']/m);
    if (nm && nm[1].trim() && nm[1].trim() !== 'Marta' && out.includes(nm[1].trim())) f.push('variavel');
    const dado = src.match(/random\.randint\(\s*1\s*,\s*(\d+)\s*\)/);
    if (dado && dado[1] !== '6' && /import\s+random/.test(src) && /\d/.test(out)) f.push('importou');
    if (/U2UgZXN0w6Fz/.test(out)) f.push('pyCorreu');
    if (/10\.0\.0\.7/.test(out) && /orucsbo_loraf/.test(out)) f.push('pyCorreu', 'decoded');
    if (/farol_obscuro/.test(out)) f.push('senha');
    return f;
  }
});
