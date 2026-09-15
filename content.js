(() => {
  let settings = {
    enabled: true,
    position: 'bottom-right',
    size: 'medium'
  };

  const box = document.createElement('div');
  box.id = 'visualizador-teclas-pressionadas';
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

  // Carrega configurações iniciais
  chrome.storage.sync.get(settings, (res) => {
    settings = res;
    applyStyles();
  });

  // Ouve mudanças feitas no Popup em tempo real
  chrome.storage.onChanged.addListener((changes) => {
    for (let [key, { newValue }] of Object.entries(changes)) {
      settings[key] = newValue;
    }
    applyStyles();
    if (!settings.enabled) {
      box.style.display = 'none';
    }
  });

  document.body.appendChild(box);

  let hideTimer;
  window.addEventListener('keydown', (e) => {
    if (!settings.enabled) return;

    let keyName = e.key;

    // Tradução de teclas comuns para exibição amigável
    const keyMap = {
      ' ': 'Espaço',
      'ArrowUp': '↑',
      'ArrowDown': '↓',
      'ArrowLeft': '←',
      'ArrowRight': '→',
      'Escape': 'Esc'
    };

    if (keyMap[keyName]) {
      keyName = keyMap[keyName];
    }

    let combo = [];
    if (e.ctrlKey && e.key !== 'Control') combo.push('Ctrl');
    if (e.altKey && e.key !== 'Alt') combo.push('Alt');
    if (e.shiftKey && e.key !== 'Shift') combo.push('Shift');
    if (e.metaKey && e.key !== 'Meta') combo.push('Super/Cmd');

    // Se a tecla pressionada for um modificador isolado (ex: apenas Shift)
    if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) {
      combo.push(e.key === 'Control' ? 'Ctrl' : e.key);
    } else {
      combo.push(keyName);
    }

    box.innerText = combo.join(' + ');
    box.style.display = 'block';
    box.style.opacity = '1';

    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      box.style.opacity = '0';
      setTimeout(() => {
        if (box.style.opacity === '0') {
          box.style.display = 'none';
        }
      }, 150);
    }, 1200);
  }, true);
})();