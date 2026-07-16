const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const fileInput = document.getElementById("fileInput");
const messageBox = document.getElementById("messageBox");

exportBtn.addEventListener("click", async () => {

  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  const mode = document.getElementById("modeAud").checked ? "aud" : "gtt";

  chrome.runtime.sendMessage({
    action: "EXPORT_COOKIES",
    url: tab.url,
    mode: mode
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

  const mode = document.getElementById("modeAud").checked ? "aud" : "gtt";

  chrome.runtime.sendMessage(
    {
      action: "IMPORT_COOKIES",
      cookies,
      url: tab.url,
      mode: mode
    },
    (response) => {
      messageBox.style.display = "block";
      if (response?.success) {
        messageBox.style.background = "rgba(16, 185, 129, 0.15)";
        messageBox.style.borderColor = "rgba(16, 185, 129, 0.4)";
        messageBox.style.color = "#d1fae5";
        messageBox.innerHTML = `
          ✅ Cookies imported successfully.<br/><br/>
          Please refresh the page.
        `;
      } else {
        messageBox.style.background = "rgba(239, 68, 68, 0.15)";
        messageBox.style.borderColor = "rgba(239, 68, 68, 0.4)";
        messageBox.style.color = "#fca5a5";
        messageBox.innerHTML = `
          ❌ Error: ${response?.error || "Failed to import cookies."}
        `;
      }
    }
  );

});
