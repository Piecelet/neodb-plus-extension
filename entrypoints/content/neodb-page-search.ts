import { svgIcon2 } from "./svg-icon";

export const neodbPageSearch = () => {
  // NeoDB Page Search Btn
  if (
    window.location.href.startsWith("https://neodb.social/") &&
    !window.location.href.startsWith("https://neodb.social/game/") &&
    !window.location.href.startsWith("https://neodb.social/performance/")
  ) {
    const box = document.getElementById("item-cover");
    if (!box) {
      return;
    }
    box.style.position = "relative";
    const SearchBtn = document.createElement("button");

    SearchBtn.innerHTML = svgIcon2;
    SearchBtn.style.backgroundColor = "green";
    SearchBtn.style.width = "28px";
    SearchBtn.style.height = "28px";
    SearchBtn.style.borderRadius = "6px";
    SearchBtn.style.padding = "0";
    SearchBtn.style.border = "none";
    SearchBtn.style.position = "absolute";
    SearchBtn.style.top = "-64px";
    SearchBtn.style.left = "0";
    SearchBtn.style.display = "flex";
    SearchBtn.style.alignItems = "center";
    SearchBtn.style.justifyContent = "center";
    box.appendChild(SearchBtn);

    SearchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const h1 = document.querySelector("#item-title h1");
      if (!h1) {
        return;
      }
      const ItemTitle = h1.firstChild?.textContent?.trim();
      if (!ItemTitle) {
        return;
      }

      const url = window.location.href;
      const match = url.match(/\/([a-zA-Z]+)\//);
      if (!match) {
        return;
      }
      const Category =
        match[1] === "tv" ? "movie" : match[1] === "album" ? "music" : match[1];

      const doubanSearchUrl = `https://search.douban.com/${Category}/subject_search?search_text=${ItemTitle}`;
      window.open(doubanSearchUrl, "_blank");
    });
  }
};
