// Intercept requests to frodo.douban.com and spoof UA/Referer

const FRODO_URLS = ["https://frodo.douban.com/*"];
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF XWEB/8391";
const REFERER =
  "https://servicewechat.com/wx2f9b06c1de1ccfca/99/page-frame.html";

export const registerNetworkHeaderSpoofing = () => {
  if (!chrome.webRequest || !chrome.webRequest.onBeforeSendHeaders) {
    return;
  }

  // 1) Prefer DNR to reliably set restricted headers for all matching requests
  try {
    const RULE_ID = 10001;
    const rule: chrome.declarativeNetRequest.Rule = {
      id: RULE_ID,
      priority: 1,
      action: {
        type: "modifyHeaders",
        requestHeaders: [
          { header: "User-Agent", operation: "set", value: USER_AGENT },
          { header: "Referer", operation: "set", value: REFERER },
        ],
      },
      condition: {
        requestDomains: ["frodo.douban.com"],
        resourceTypes: [
          `${chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST}`,
          `${chrome.declarativeNetRequest.ResourceType.OTHER}`,
        ],
      },
    };
    // Replace if exists
    chrome.declarativeNetRequest.updateSessionRules({
      addRules: [rule],
      removeRuleIds: [RULE_ID],
    });
  } catch (e) {
    // Fall back to webRequest if DNR isn't available
    // eslint-disable-next-line no-console
    console.warn("DNR header spoofing setup failed, falling back to webRequest", e);
  }

  // 2) Fallback via webRequest for cases where DNR isn't applied
  const listener = (
    details: chrome.webRequest.OnBeforeSendHeadersDetails,
  ): chrome.webRequest.BlockingResponse => {
    const headers = details.requestHeaders ?? [];

    const setHeader = (name: string, value: string) => {
      const found = headers.find(
        (h) => h.name.toLowerCase() === name.toLowerCase(),
      );
      if (found) {
        found.value = value;
      } else {
        headers.push({ name, value });
      }
    };

    setHeader("User-Agent", USER_AGENT);
    setHeader("Referer", REFERER);

    return { requestHeaders: headers };
  };

  // Use extraHeaders so we can modify sensitive headers like User-Agent/Referer
  const extraInfoSpec = [
    "blocking",
    "requestHeaders",
    "extraHeaders",
  ] as `${chrome.webRequest.OnBeforeSendHeadersOptions}`[];

  chrome.webRequest.onBeforeSendHeaders.addListener(
    listener,
    { urls: FRODO_URLS },
    extraInfoSpec,
  );
};
