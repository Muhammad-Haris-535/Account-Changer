// background.js

chrome.runtime.onMessage.addListener((message) => {

  // EXPORT
  if (message.action === "EXPORT_COOKIES") {

    chrome.cookies.getAll(
      {
        url: message.url
      },
      (cookies) => {

        const filteredCookies = cookies.filter(cookie =>
          cookie.name.startsWith("__Secure-next-auth.session-token")
        );

        const jsonData = JSON.stringify(filteredCookies, null, 2);

        const dataUrl =
          "data:application/json;charset=utf-8," +
          encodeURIComponent(jsonData);

        chrome.downloads.download({
          url: dataUrl,
          filename: "next-auth-cookies.json",
          saveAs: true
        });

      }
    );

  }

  // IMPORT
  if (message.action === "IMPORT_COOKIES") {

    const cookies = message.cookies;

    cookies.forEach((cookie) => {

      chrome.cookies.set({
        url: message.url,
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        sameSite: cookie.sameSite,
        expirationDate: cookie.expirationDate
      }, () => {

        if (chrome.runtime.lastError) {
          console.log("ERROR:", chrome.runtime.lastError);
        } else {
          console.log("UPDATED:", cookie.name);
        }

      });

    });

  }

});