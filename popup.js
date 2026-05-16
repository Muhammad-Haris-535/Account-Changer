// popup.js

const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const fileInput = document.getElementById("fileInput");

exportBtn.addEventListener("click", async () => {

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  chrome.runtime.sendMessage({
    action: "EXPORT_COOKIES",
    url: tab.url
  });

});

importBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", async (event) => {

  const file = event.target.files[0];

  if (!file) return;

  const text = await file.text();

  const cookies = JSON.parse(text);

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  chrome.runtime.sendMessage({
    action: "IMPORT_COOKIES",
    cookies,
    url: tab.url
  });

});