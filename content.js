(() => {
  const OVERLAY_ID = 'visualizador-teclas-pressionadas';
  const MESSAGE_TYPE = 'VISUALIZADOR_TECLA_PRESSIONADA';
  const isTopFrame = window === window.top;

  let settings = {
    enabled: true,
    position: 'bottom-right',
    size: 'medium'
  };

  // Traduz a tecla e os modificadores em um rótulo legível.
  function buildComboLabel(event) {
    const keyMap = {
      ' ': 'Espaço',
      'ArrowUp': '↑',
      'ArrowDown': '↓',
      'ArrowLeft': '←',
      'ArrowRight': '→',
      'Escape': 'Esc'
    };

    const modifierKeys = ['Control', 'Alt', 'Shift', 'Meta'];
    const combo = [];

    if (event.ctrlKey && event.key !== 'Control') combo.push('Ctrl');
    if (event.altKey && event.key !== 'Alt') combo.push('Alt');
    if (event.shiftKey && event.key !== 'Shift') combo.push('Shift');
    if (event.metaKey && event.key !== 'Meta') combo.push('Super/Cmd');

    if (modifierKeys.includes(event.key)) {
      combo.push(event.key === 'Control' ? 'Ctrl' : event.key);
    } else {
      combo.push(keyMap[event.key] || event.key);
    }

    return combo.join(' + ');
  }

  // Frames internos apenas encaminham a tecla para o frame superior,
  // evitando visualizador cortado pelo viewport do iframe.
  if (!isTopFrame) {
    window.addEventListener('keydown', (event) => {
      if (!settings.enabled) return;

      try {
        chrome.runtime.sendMessage({
          type: MESSAGE_TYPE,
          label: buildComboLabel(event)
        });
      } catch {
        // Contexto da extensão invalidado (recarregada): ignora silenciosamente.
      }
    }, true);

    chrome.storage.sync.get(settings, (stored) => {
      settings = stored;
    });

    chrome.storage.onChanged.addListener((changes) => {
      for (const [key, { newValue }] of Object.entries(changes)) {
        settings[key] = newValue;
      }
    });

    return;
  }

  const box = document.createElement('div');
  box.id = OVERLAY_ID;
  box.style.position = 'fixed';
  box.style.background = 'rgba(0, 0, 0, 0.88)';
  box.style.color = '#00ffcc';
  box.style.fontWeight = 'bold';
  box.style.fontFamily = 'monospace';
  box.style.borderRadius = '8px';
  box.style.zIndex = '2147483647';
  box.style.pointerEvents = 'none';
  box.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.4)';
  box.style.display = 'none';
  box.style.transition = 'opacity 0.15s ease-out';

  function applyStyles() {
    // Reset de posições
    box.style.top = 'auto';
    box.style.bottom = 'auto';
    box.style.left = 'auto';
    box.style.right = 'auto';

    switch (settings.position) {
      case 'top-left':
        box.style.top = '24px';
        box.style.left = '24px';
        break;
      case 'top-right':
        box.style.top = '24px';
        box.style.right = '24px';
        break;
      case 'bottom-left':
        box.style.bottom = '24px';
        box.style.left = '24px';
        break;
      case 'bottom-right':
      default:
        box.style.bottom = '24px';
        box.style.right = '24px';
        break;
    }

    switch (settings.size) {
      case 'small':
        box.style.fontSize = '16px';
        box.style.padding = '8px 14px';
        break;
      case 'large':
        box.style.fontSize = '30px';
        box.style.padding = '16px 26px';
        break;
      case 'medium':
      default:
        box.style.fontSize = '22px';
        box.style.padding = '12px 20px';
        break;
    }
  }

  // Aplicações SPA podem substituir o conteúdo do body e remover o visualizador.
  function ensureAttached() {
    if (!document.body) return;
    if (!box.isConnected) {
      document.body.appendChild(box);
    }
  }

  // Carrega configurações iniciais
  chrome.storage.sync.get(settings, (stored) => {
    settings = stored;
    applyStyles();
  });

  // Ouve mudanças feitas no Popup em tempo real
  chrome.storage.onChanged.addListener((changes) => {
    for (const [key, { newValue }] of Object.entries(changes)) {
      settings[key] = newValue;
    }
    applyStyles();
    if (!settings.enabled) {
      box.style.display = 'none';
    }
  });

  ensureAttached();

  // Com run_at document_start o body ainda pode não existir.
  if (!document.body) {
    document.addEventListener('DOMContentLoaded', ensureAttached, { once: true });
  }

  let hideTimer;
  let fadeTimer;

  function showLabel(label) {
    if (!settings.enabled || !label) return;

    ensureAttached();

    box.innerText = label;
    box.style.display = 'block';
    box.style.opacity = '1';

    clearTimeout(hideTimer);
    clearTimeout(fadeTimer);

    hideTimer = setTimeout(() => {
      box.style.opacity = '0';
      fadeTimer = setTimeout(() => {
        if (box.style.opacity === '0') {
          box.style.display = 'none';
        }
      }, 150);
    }, 1200);
  }

  window.addEventListener('keydown', (event) => {
    showLabel(buildComboLabel(event));
  }, true);

  // Recebe teclas capturadas em iframes da mesma aba.
  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === MESSAGE_TYPE) {
      showLabel(message.label);
    }
  });
})();
