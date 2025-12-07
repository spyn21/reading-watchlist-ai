chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openDashboard") {
    const encodedData = encodeURIComponent(JSON.stringify(message.data));
    const dashboardUrl = `http://localhost:5173/dashboard?data=${encodedData}`;

    chrome.tabs.query({}, (tabs) => {
      const existingTab = tabs.find(tab =>
        tab.url && tab.url.includes("localhost:5173/dashboard")
      );

      if (existingTab) {
        chrome.tabs.update(existingTab.id, { url: dashboardUrl, active: true });
      } else {
        chrome.tabs.create({ url: dashboardUrl });
      }
    });
  }
});