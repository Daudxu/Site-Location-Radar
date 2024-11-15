// 处理来自content script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getIpInfo') {
    const { hostname } = request;
    
    // 使用Cloudflare DNS查询IP
    fetch(`https://cloudflare-dns.com/dns-query?name=${hostname}&type=A`, {
      headers: {
        'Accept': 'application/dns-json'
      }
    })
    .then(response => response.json())
    .then(async data => {
      if (data.Answer && data.Answer[0] && data.Answer[0].type === 1) {
        const ip = data.Answer[0].data;
        
        // 查询IP地理位置
        const response = await fetch(`http://ip-api.com/json/${ip}?lang=zh-CN`);
        const ipInfo = await response.json();
        
        if (ipInfo.status === 'success') {
          sendResponse({
            ip: ip,
            location: `${ipInfo.country} ${ipInfo.regionName} ${ipInfo.city}`.trim()
          });
        } else {
          sendResponse({
            ip: ip,
            location: '位置查询失败'
          });
        }
      } else {
        sendResponse({
          ip: '未知',
          location: 'DNS查询失败'
        });
      }
    })
    .catch(error => {
      console.error('Error:', error);
      sendResponse({
        ip: '错误',
        location: '查询失败'
      });
    });
    
    return true; // 保持消息通道开放
  }
});