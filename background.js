chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url && !tab.url.startsWith("chrome://") && !tab.url.startsWith("about:")) {
      const url = new URL(tab.url);
      const hostname = url.hostname;
  
      // 检查是否为本地地址
      const isLocalAddress = hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
  
      if (isLocalAddress) {
        // 如果是本地地址，显示本地 IP
        displayIp(tabId, hostname, "本地地址");
      } else {
        // 获取服务器 IP 地址
        fetch(`https://cloudflare-dns.com/dns-query?name=${hostname}`, {
          headers: { 'Accept': 'application/dns-json' }
        })
          .then(response => response.json())
          .then(data => {
            const ipAnswer = data.Answer ? data.Answer.find(record => record.type === 1) : null;
            const ip = ipAnswer ? ipAnswer.data : "IP 未知";
  
            // 获取该 IP 地址的中文地理信息
            fetch(`http://ip-api.com/json/${ip}?lang=zh-CN`)  // 使用 ip-api 获取中文地理信息
              .then(response => response.json())
              .then(ipInfo => {
                const location = ipInfo.city && ipInfo.region && ipInfo.country 
                  ? `${ipInfo.city}, ${ipInfo.region}, ${ipInfo.country}` 
                  : "未知区域";  // 如果没有返回 city、region 和 country 字段，则显示 "未知区域"
                displayIp(tabId, ip, location);
              })
              .catch(error => console.error("获取 IP 地理信息失败:", error));
          })
          .catch(error => console.error("获取服务器 IP 出错:", error));
      }
    }
  });
  
  // 显示 IP 地址的函数
  function displayIp(tabId, ip, location) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: (ip, location) => {
        const ipElement = document.createElement("div");
        ipElement.textContent = `服务器 IP: ${ip} ${location}`;
        ipElement.style.position = "fixed";
        ipElement.style.bottom = "20px";
        ipElement.style.right = "20px";
        ipElement.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        ipElement.style.color = "white";
        ipElement.style.padding = "10px";
        ipElement.style.borderRadius = "5px";
        ipElement.style.zIndex = "10000";
        ipElement.style.fontSize = "14px";
        document.body.appendChild(ipElement);
      },
      args: [ip, location]
    });
  }
  