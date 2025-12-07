function extractReadableContent() {
  const title = document.title;
  const url = window.location.href;
  const bodyText = document.body.innerText || "";

  return {
    title,
    type: url.includes("youtube.com") ? "video" : "article",
    url,
    text: bodyText.slice(0, 3000), // Limit size
  };
}

// ✅ Block extension from running on dashboard and search
if (
  !window.location.href.includes("localhost:5173/dashboard") &&
  !window.location.href.includes("google.com/search")
) {
  const pageData = extractReadableContent();

  chrome.runtime.sendMessage({ action: "openDashboard", data: pageData });
}