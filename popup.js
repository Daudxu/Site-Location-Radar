document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('displayToggle');

  // 加载保存的设置
  chrome.storage.local.get('ipDisplayEnabled', (data) => {
    toggle.checked = data.ipDisplayEnabled !== false;
  });

  // 监听开关变化
  toggle.addEventListener('change', () => {
    const enabled = toggle.checked;
    chrome.storage.local.set({ ipDisplayEnabled: enabled });

    // 向当前标签页发送消息
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: 'toggleDisplay', 
          enabled: enabled 
        });
      }
    });
  });
});
