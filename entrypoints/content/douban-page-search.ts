import { svgIcon } from "./svg-icon";

export const doubanPageSearch = () => {
  
// Douban Page Seach Btn
if (
    (window.location.hostname === "music.douban.com" ||
      window.location.hostname === "movie.douban.com" ||
      window.location.hostname === "book.douban.com") &&
    /^\/subject\/\d+\/?$/.test(window.location.pathname)
  ) {
    const wrapper = document.querySelector("#wrapper") as HTMLElement;
    if (wrapper) {
      const searchButton = document.createElement("a");
      wrapper.style.position = "relative";
      searchButton.style.position = "absolute";
      searchButton.style.top = "-2px";
      searchButton.style.right = "0";
      searchButton.innerHTML = svgIcon;
      searchButton.href = "#";
      searchButton.style.backgroundColor = "#FFFFFF";
      searchButton.style.border = "1px solid #ddd";
      searchButton.style.borderRadius = "6px";
      searchButton.style.width = "300px";
      searchButton.style.height = "32px";
      searchButton.style.textAlign = "center";
      searchButton.style.display = "flex";
      searchButton.style.alignItems = "center";
      searchButton.style.justifyContent = "center";
  
      searchButton.addEventListener("click", (e) => {
        e.preventDefault();
        const currentUrl = window.location.href;
        const neodbSearchUrl = `https://neodb.social/search?q=${currentUrl}`;
        window.open(neodbSearchUrl, "_blank");
      });
  
      wrapper.appendChild(searchButton);
    }
  }  
};