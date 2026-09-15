# Visualizador de Teclas Pressionadas

Extensão leve para Google Chrome (Manifest V3) desenvolvida para screencasts, gravações com OBS Studio e demonstrações de testes de acessibilidade web (a11y). Exibe teclas pressionadas e combinações de atalhos em tempo real em um visualizador flutuante na página.

---

## Recursos

* **Captura de Teclas de Acessibilidade:** Exibe teclas críticas de navegação por teclado (`Tab`, `Shift + Tab`, `Enter`, `Espaço`, setas de navegação).
* **Suporte a Atalhos:** Combinações com `Ctrl`, `Alt`, `Shift` e `Super/Cmd`.
* **Posicionamento Customizável:** Quatro cantos da tela (Inferior Direito, Inferior Esquerdo, Superior Direito, Superior Esquerdo).
* **Tamanhos Ajustáveis:** Pequeno (`16px`), Médio (`22px`) e Grande (`30px`).
* **Interruptor Liga/Desliga:** Ative ou desative o visualizador diretamente pelo popup da extensão sem desinstalar.
* **Sincronização em Tempo Real:** Alterações feitas no menu de opções refletem instantaneamente nas abas abertas sem necessidade de recarregar (`F5`).
* **Não Bloqueia Cliques:** Utiliza `pointer-events: none` para que o visualizador não interfira na interação com a página.

---

## Estrutura do Projeto

```text
plugin-mostrador-de-teclas/
├── manifest.json   # Configuração e permissões da extensão (Manifest V3)
├── popup.html      # Interface gráfica do painel de controle
├── popup.js        # Script de manipulação do painel e persistência de dados
├── content.js      # Injeção do visualizador na página e escuta de eventos do teclado
└── README.md       # Documentação do projeto
```

---

## Como Instalar (Modo Desenvolvedor)

1. Clone ou baixe este repositório para uma pasta local:
   ```bash
   git clone https://github.com/Patrickaalves/plugin-mostrador-de-teclas.git
   ```
2. Abra o Google Chrome e navegue até:
   ```text
   chrome://extensions
   ```
3. No canto superior direito, ative a chave **Modo do desenvolvedor**.
4. Clique no botão **Carregar sem compactação** (ou *Load unpacked*).
5. Selecione a pasta `plugin-mostrador-de-teclas` onde estão os arquivos do projeto.
6. Fixe o ícone da extensão na barra de ferramentas clicando no ícone de "quebra-cabeça" do Chrome.

---

## Como Usar

1. Acesse qualquer página web (ex: `https://example.com`).
2. Clique no ícone do **Visualizador de Teclas Pressionadas** na barra do navegador para abrir as configurações:
   * **Ativar visualizador:** Marque ou desmarque para ligar/desligar o visualizador flutuante.
   * **Posição na tela:** Escolha o canto de sua preferência.
   * **Tamanho:** Escolha entre Pequeno, Médio ou Grande.
3. Clique em qualquer área da página e pressione `Tab`, `Enter` ou atalhos como `Ctrl + Alt + K`. O visualizador exibirá as teclas automaticamente.

---

## Dicas para Gravação no OBS Studio

* **Captura de Janela / Aba:** Ao capturar a janela do Chrome via PipeWire/Xcomposite, as teclas serão gravadas com contraste nítido sobre o conteúdo web.
* **Limitação Técnica:** Extensões do Chrome operam apenas dentro do contexto DOM da página aberta. Teclas pressionadas com foco na barra de endereços (URL), configurações internas (`chrome://`) ou dentro do console DevTools (F12) não disparam eventos capturáveis por extensões devido ao modelo de segurança do navegador.

---

## Licença

Distribuído sob a licença MIT.