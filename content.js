// 创建并显示IP信息元素
function createIpDisplay() {
  const container = document.createElement('div');
  container.id = 'ip-display-container';
  container.style.cssText = `
    position: fixed;
    right: 0;
    bottom: 20px;
    display: flex;
    align-items: center;
    z-index: 2147483647;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;

  const arrow = document.createElement('div');
  arrow.style.cssText = `
    width: 30px;
    height: 40px;
    background-color: rgba(0, 0, 0, 0.7);
    border-radius: 5px 0 0 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 20px;
    position: absolute;
    left: -30px;
    cursor: pointer;
  `;
  arrow.innerHTML = '►';

  const content = document.createElement('div');
  content.style.cssText = `
    padding: 10px 15px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    border-radius: 5px 0 0 5px;
    font-size: 14px;
    font-family: Arial, sans-serif;
    white-space: nowrap;
  `;

  container.appendChild(content);
  container.appendChild(arrow);
  document.body.appendChild(container);

  // 添加鼠标事件
  const showContent = () => {
    container.style.transform = 'translateX(0)';
    arrow.innerHTML = '◄';
  };

  const hideContent = () => {
    container.style.transform = 'translateX(100%)';
    arrow.innerHTML = '►';
  };

  container.addEventListener('mouseenter', showContent);
  container.addEventListener('mouseleave', hideContent);

  return content;
}

// 获取当前网页的IP信息
function fetchIpInfo() {
  const hostname = window.location.hostname;
  chrome.runtime.sendMessage(
    { action: 'getIpInfo', hostname: hostname },
    function(response) {
      if (response && response.ip) {
        let ipDisplay = document.getElementById('ip-display-container');
        if (!ipDisplay) {
          ipDisplay = createIpDisplay();
        }
        ipDisplay.textContent = `服务器 IP: ${response.ip}\n${response.location}`;
      }
    }
  );
}

// 页面加载完成后获取IP信息
window.addEventListener('load', fetchIpInfo);