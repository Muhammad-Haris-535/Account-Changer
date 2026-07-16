chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // EXPORT
  if (message.action === "EXPORT_COOKIES") {
    chrome.cookies.getAll(
      {
        url: message.url,
      },
      (cookies) => {
        let filteredCookies;
        let filename;

        if (message.mode === "aud") {
          const targetNames = ["sessionKey", "sessionKeyLC", "activitySessionId"];
          filteredCookies = cookies.filter((cookie) =>
            targetNames.includes(cookie.name)
          );
          filename = "aud-cookies.json";
        } else {
          // Default/GTT mode
          filteredCookies = cookies.filter((cookie) =>
            cookie.name.startsWith("__Secure-next-auth.session-token")
          );
          filename = "next-auth-cookies.json";
        }

        const jsonData = JSON.stringify(filteredCookies, null, 2);

        const dataUrl =
          "data:application/json;charset=utf-8," + encodeURIComponent(jsonData);

        chrome.downloads.download({
          url: dataUrl,
          filename: filename,
          saveAs: true,
        });
      },
    );
  }

  // IMPORT
  if (message.action === "IMPORT_COOKIES") {
    let cookies = message.cookies;

    if (message.mode === "aud") {
      const targetNames = ["sessionKey", "sessionKeyLC", "activitySessionId"];
      cookies = cookies.filter((cookie) => targetNames.includes(cookie.name));
    }

    if (!cookies || cookies.length === 0) {
      sendResponse({
        success: false,
        error: `No cookies matching the selected mode (${message.mode || "gtt"}) were found in the uploaded file.`
      });
      return;
    }

    let completed = 0;
    let hasError = false;

    cookies.forEach((cookie) => {
      chrome.cookies.set(
        {
          url: message.url,
          name: cookie.name,
          value: cookie.value,
          domain: cookie.domain,
          path: cookie.path,
          secure: cookie.secure,
          httpOnly: cookie.httpOnly,
          sameSite: cookie.sameSite,
          expirationDate: cookie.expirationDate,
        },
        () => {
          completed++;

          if (chrome.runtime.lastError) {
            console.log("ERROR:", chrome.runtime.lastError);
            hasError = true;
          } else {
            console.log("UPDATED:", cookie.name);
          }

          if (completed === cookies.length) {
            if (hasError) {
              sendResponse({
                success: false,
                error: "Failed to write some cookies."
              });
            } else {
              sendResponse({
                success: true,
              });
            }
          }
        },
      );
    });

    return true;
  }
});
