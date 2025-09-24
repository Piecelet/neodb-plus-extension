export const isNeoDBSite = (): boolean => {
  try {
    const links = Array.from(
      document.querySelectorAll<HTMLLinkElement>("link[href]"),
    );
    return links.some((link) => {
      const href = link.getAttribute("href") || "";
      return href.includes("/scss/neodb");
    });
  } catch {
    return false;
  }
};
