# FAROL — jogo de hacker em português

Compraste um computador velho na Feira da Ladra. Lá dentro há uma mensagem escondida.
Para a ler vais aprender a usar um terminal Linux e a escrever o teu primeiro código em Python.

**Jogar:** abre o link do GitHub Pages deste repositório no navegador (computador ou telemóvel).

- Missão 1: *O computador do sótão* (~10 minutos)
- Um computador de 2009 simulado no navegador: ambiente de trabalho, janelas, terminal Linux, ficheiros e correio
- Python a sério no navegador, com [Pyodide](https://pyodide.org)
- O progresso fica guardado no teu navegador
- Tudo é ficção e corre só na tua máquina: sem servidores, sem contas, sem instalar nada

## Estrutura

- `index.html`, `style.css`, `ambiente.js` (janelas e barra de tarefas), `jogo.js` (terminal, Python, ficheiros, correio, progresso)
- `missoes/missao1.js` — história, ficheiros e passos da missão 1

Site estático: para correr localmente basta `python -m http.server` nesta pasta.
