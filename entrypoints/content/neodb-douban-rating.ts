import { sendMessage } from "webext-bridge/content-script";

import type { FrodoSubjectResponse } from "../shared/douban-rating";

const RATING_CONTAINER_SELECTOR = "[data-neodb-douban-rating]";

const extractDoubanId = (href: string) => {
  const match = href.match(/subject\/(\d+)/);
  return match?.[1] ?? null;
};

const ensureContainer = (siteList: Element) => {
  let container = siteList.querySelector<HTMLDivElement>(
    RATING_CONTAINER_SELECTOR,
  );

  if (container) {
    return container;
  }

  container = document.createElement("div");
  container.dataset.neodbDoubanRating = "true";
  container.style.marginTop = "8px";
  container.style.fontSize = "14px";
  container.style.lineHeight = "20px";
  container.style.color = "var(--np-secondary-text, #5f6368)";
  siteList.appendChild(container);

  return container;
};

const formatRating = (response: FrodoSubjectResponse) => {
  const rating = response.rating;
  if (!rating?.value) {
    return null;
  }

  const value = rating.value.toFixed(1);
  const count = rating.count ? rating.count.toLocaleString("zh-CN") : null;
  const countText = count ? `（基于 ${count} 人评分）` : "";
  return `豆瓣评分：${value}${countText}`;
};

const fetchDoubanRating = (doubanId: string) =>
  sendMessage<FrodoSubjectResponse>(
    "fetch-douban-rating",
    { doubanId },
    "background",
  );

const attachRating = async (siteList: Element) => {
  const existing = siteList.querySelector(RATING_CONTAINER_SELECTOR);
  if (existing) {
    return true;
  }

  const doubanAnchor = siteList.querySelector<HTMLAnchorElement>(
    "a.douban",
  );
  if (!doubanAnchor) {
    return false;
  }

  const doubanId = extractDoubanId(doubanAnchor.href);
  if (!doubanId) {
    return false;
  }

  const container = ensureContainer(siteList);
  container.textContent = "豆瓣评分加载中…";

  try {
    const data = await fetchDoubanRating(doubanId);
    const text = data ? formatRating(data) : null;
    container.textContent = text ?? "豆瓣评分暂无数据";
  } catch (error) {
    console.error("Failed to load Douban rating", error);
    container.textContent = "豆瓣评分获取失败";
  }

  return true;
};

export const neodbDoubanRating = () => {
  if (!window.location.href.startsWith("https://neodb.social")) {
    return;
  }

  const run = async () => {
    const immediateList = document.querySelector(".site-list");
    if (immediateList && (await attachRating(immediateList))) {
      return;
    }

    const observer = new MutationObserver(async () => {
      const siteList = document.querySelector(".site-list");
      if (siteList && (await attachRating(siteList))) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    void run();
  }
};
