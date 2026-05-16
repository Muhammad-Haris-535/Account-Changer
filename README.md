# Account Changer — Chrome Extension

> A lightweight Chrome extension to **export and import ChatGPT session cookies**, allowing you to transfer an active login from one browser (or machine) to another — no password required.

---

## 📌 What It Does

ChatGPT uses a cookie named `__Secure-next-auth.session-token` to keep you logged in. This extension:

1. **Export** — Reads that session cookie from your current browser and saves it as a `.json` file on your computer.
2. **Import** — Reads a previously exported `.json` file and injects those cookies into your current browser, instantly logging you in as that account.

No credentials. No OTPs. Just a JSON file.

---

## 🗂️ Project Structure

```
Account Changer/
├── manifest.json      # Extension config & permissions
├── background.js      # Cookie read/write logic (service worker)
├── popup.html         # Extension UI (popup window)
├── popup.css         # Extension UI Styling
└── popup.js           # UI button event handlers
```

---

## ⚙️ How It Works (Technical)

### Export Flow
1. User clicks **Export Cookies** in the popup.
2. `popup.js` gets the current active tab's URL and sends an `EXPORT_COOKIES` message to `background.js`.
3. `background.js` calls `chrome.cookies.getAll({ url })` and filters for cookies whose name starts with `__Secure-next-auth.session-token`.
4. The filtered cookies are serialized to JSON and downloaded as **`next-auth-cookies.json`** via `chrome.downloads.download()`.

### Import Flow
1. User clicks **Import Cookies** — a hidden file input (`<input type="file">`) opens a file picker.
2. User selects their previously exported `.json` file.
3. `popup.js` reads the file, parses the JSON array, and sends an `IMPORT_COOKIES` message to `background.js`.
4. `background.js` iterates over each cookie object and calls `chrome.cookies.set()` to plant them in the browser for the current URL.
5. On next page refresh, the browser sends those cookies to ChatGPT's server — you're logged in.

---

## 🔐 Permissions Used

| Permission | Why It's Needed |
|---|---|
| `cookies` | To read and write session cookies |
| `tabs` | To get the URL of the currently active tab |
| `downloads` | To save the exported JSON file to disk |
| `<all_urls>` | To access cookies across all domains (required for cross-domain cookie operations) |

---

## 🚀 Installation (Load Unpacked)

1. Download and unzip the extension folder.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer Mode** (top-right toggle).
4. Click **Load unpacked** and select the `Account Changer` folder.
5. The extension icon will appear in your toolbar.

---

## 📖 Usage Guide

### To Export a Session (Source Browser)
1. Open [https://chat.openai.com](https://chat.openai.com) and make sure you're logged in.
2. Click the **Account Changer** extension icon.
3. Click **Export Cookies**.
4. Save the file `next-auth-cookies.json` anywhere on your computer.

### To Import a Session (Target Browser)

> [!IMPORTANT]
> **⚠️ Import karne se pehle zaroori hai ke aap kisi bhi ChatGPT chat screen par hon.**
> Import button tab hi kaam karega jab active tab `chat.openai.com` ka koi bhi page ho — preferably koi khuli hui chat (e.g. `https://chat.openai.com/c/...`). Agar aap kisi aur page par hain (Google, YouTube, etc.) to cookies galat URL par set ho jaenge aur login kaam nahi karega.

1. Open [https://chat.openai.com](https://chat.openai.com) in the target browser (you can be logged out).
2. **Make sure you are on a ChatGPT chat screen** (any chat page on `chat.openai.com`). This is required for the import to work correctly.
3. Click the **Account Changer** extension icon.
4. Click **Import Cookies** and select your `next-auth-cookies.json` file.
5. Refresh the page — you will be logged in automatically.

---

## ⚠️ Important Notes

- 🔴 **Import karte waqt ChatGPT ki kisi bhi chat screen par hona ZAROORI hai.** Kisi aur site ya tab par hone se cookies galat jagah set honge aur login fail ho jaega.
- This extension only works on sites using **NextAuth.js** session cookies (e.g., ChatGPT / chat.openai.com).
- The exported JSON file contains **your active session token** — treat it like a password. Do not share it.
- Session tokens expire. If the exported cookie has expired, importing it will not work.
- This does **not** bypass 2FA permanently — it transfers an already-authenticated session.

---

## 🛠️ Tech Stack

- **Manifest V3** — Latest Chrome Extension standard
- **Vanilla JavaScript** — No frameworks or dependencies
- **Chrome Extensions API** — `cookies`, `tabs`, `downloads`, `runtime`

---

## 👨‍💻 Author

**Muhammad Haris**
[LinkedIn → muhammad-haris-dev](https://www.linkedin.com/in/muhammad-haris-dev)

---

## 📄 License

This project is for personal/educational use. Use responsibly and only on accounts you own.
