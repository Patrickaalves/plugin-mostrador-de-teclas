const MESSAGE_TYPE = 'VISUALIZADOR_TECLA_PRESSIONADA';
const TOP_FRAME_ID = 0;

// Encaminha a tecla capturada em um iframe para o frame principal da mesma aba,
// que é o único responsável por exibir o visualizador.
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message?.type !== MESSAGE_TYPE) return;
  if (!sender.tab?.id) return;

  chrome.tabs
    .sendMessage(sender.tab.id, message, { frameId: TOP_FRAME_ID })
    .catch(() => {
      // Frame principal sem content script (página restrita) ou aba fechada.
    });
});
