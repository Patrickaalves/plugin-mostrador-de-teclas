const defaultSettings = {
  enabled: true,
  position: 'bottom-right',
  size: 'medium'
};

const enabledCheckbox = document.getElementById('enabled');
const positionSelect = document.getElementById('position');
const sizeSelect = document.getElementById('size');

// Carrega configurações salvas
chrome.storage.sync.get(defaultSettings, (settings) => {
  enabledCheckbox.checked = settings.enabled;
  positionSelect.value = settings.position;
  sizeSelect.value = settings.size;
});

// Atualiza storage quando houver alterações
function updateSettings() {
  chrome.storage.sync.set({
    enabled: enabledCheckbox.checked,
    position: positionSelect.value,
    size: sizeSelect.value
  });
}

enabledCheckbox.addEventListener('change', updateSettings);
positionSelect.addEventListener('change', updateSettings);
sizeSelect.addEventListener('change', updateSettings);