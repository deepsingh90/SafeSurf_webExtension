const BLOCKED_DOMAINS_KEY = 'blockedDomains';
const MAX_BLOCKED_DOMAINS = 5;
const API_URL = 'http://localhost/store_blocked_domains.php'; // Your PHP backend URL

async function init() {
  const fetchBlockedDomains = await fetch('https://raw.githubusercontent.com/deepsingh90/SafeSurf_webExtension/main/Dangerous_websites_data.json');
  console.log("Blocked domains fetched not in json:", fetchBlockedDomains);
  const blockedDomains = await fetchBlockedDomains.json();

  const currentURL = new URL(window.location.href);
  console.log("Current URL href:", currentURL.href);
  if (blockedDomains.some(domain => currentURL.hostname.includes(domain))) {
    storeBlockedDomain(currentURL.hostname);
    displayBlockedContent();
  }
}

function storeBlockedDomain(domain) {
  chrome.storage.local.get([BLOCKED_DOMAINS_KEY], function(result) {
    let storedBlockedDomains = result[BLOCKED_DOMAINS_KEY] || [];
    
    if (!storedBlockedDomains.includes(domain)) {
      storedBlockedDomains.push(domain);
    }

    if (storedBlockedDomains.length > MAX_BLOCKED_DOMAINS) {
      storedBlockedDomains = storedBlockedDomains.slice(-MAX_BLOCKED_DOMAINS);
    }

    chrome.storage.local.set({ [BLOCKED_DOMAINS_KEY]: storedBlockedDomains }, function() {
      console.log('Blocked domains stored:', storedBlockedDomains);
      if (storedBlockedDomains.length >= MAX_BLOCKED_DOMAINS) {
        sendBlockedDomainsToServer(storedBlockedDomains);
        console.log('Reached the limit of blocked domains:', storedBlockedDomains);
      }
    });
  });
}

function sendBlockedDomainsToServer(blockedDomains) {
  blockedDomains.forEach(domain => {
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ domain })
    })
    .then(response => response.json())
    .then(result => console.log('Blocked domain sent:', result))
    .catch(error => console.error('Error sending blocked domain:', error));
  });
}




function displayBlockedContent() {
  document.documentElement.innerHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Website Blocked</title>
      <style>
        body {
          font-family: 'Roboto', sans-serif;
          margin: 0;
          padding: 0;
          background: linear-gradient(135deg, #ff7e5f, #feb47b);
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          overflow: hidden;
        }
        .container {
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          max-width: 600px;
          width: 90%;
          padding: 30px;
          text-align: center;
          animation: slideIn 0.6s ease-out;
        }
        @keyframes slideIn {
          from {
            transform: translateY(-30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        h1 {
          font-size: 36px;
          color: #333333;
          margin-bottom: 20px;
          font-weight: 700;
        }
        p {
          font-size: 18px;
          color: #555555;
          margin-bottom: 20px;
          line-height: 1.5;
        }
        .contact {
          font-size: 16px;
          color: #007bff;
          text-decoration: none;
          font-weight: 500;
        }
        .contact:hover {
          color: #0056b3;
          text-decoration: underline;
        }
        .icon {
          width: 100px;
          margin-bottom: 20px;
          animation: rotate 1s infinite linear;
        }
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @media (max-width: 600px) {
          h1 {
            font-size: 28px;
          }
          p {
            font-size: 16px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v4l3 3M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/></svg>
        <h1>Access Blocked</h1>
        <p>We have blocked access to this website due to security policies.</p>
        <p>If you think this is a mistake, please reach out to your network administrator for further assistance.</p>
        <a href="mailto:deep94725kumar@gmail.com" class="contact">Contact Administrator</a>
      </div>
    </body>
    </html>
  `;
}


init();
