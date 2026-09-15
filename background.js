const MESSAGE_TYPE = 'VISUALIZADOR_TECLA_PRESSIONADA';
const LAST_KEY_REQUEST = 'VISUALIZADOR_ULTIMA_TECLA';
const LAST_KEY_STORAGE = 'ultimaTecla';
const TOP_FRAME_ID = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Frame principal recém-carregado pergunta se houve tecla logo antes
  // da navegação ou da abertura de nova aba, para não perder o registro.
  if (message?.type === LAST_KEY_REQUEST) {
    chrome.storage.session
      .get({ [LAST_KEY_STORAGE]: null })
      .then(async (stored) => {
        const lastKey = stored[LAST_KEY_STORAGE];

        // Consumo único: evita repetir a mesma tecla em cada página carregada.
        if (lastKey) {
          await chrome.storage.session.remove(LAST_KEY_STORAGE);
        }

        sendResponse(lastKey);
      })
      .catch(() => sendResponse(null));

    return true;
  }

  if (message?.type !== MESSAGE_TYPE) return;

  chrome.storage.session
    .set({ [LAST_KEY_STORAGE]: { label: message.label, at: Date.now() } })
    .catch(() => {
      // Sem storage de sessão disponível: segue apenas com o encaminhamento.
    });

  // Teclas capturadas em iframes são exibidas pelo frame principal da aba.
  if (sender.tab?.id && sender.frameId !== TOP_FRAME_ID) {
    chrome.tabs
      .sendMessage(sender.tab.id, message, { frameId: TOP_FRAME_ID })
      .catch(() => {
        // Frame principal sem content script (página restrita) ou aba fechada.
      });
  }
});
