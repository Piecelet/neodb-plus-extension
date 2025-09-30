import React from "react";
import { createRoot } from "react-dom/client";
import { isNeoDBSite } from "@/entrypoints/content/lib/is-neodb";
import { DoubanRatingCard } from "./components/douban-rating-card";

const RATING_CONTAINER_SELECTOR = "[data-neodb-douban-rating]";
const SIDEBAR_SELECTOR = "#item-sidebar";
const DOUBAN_ANCHOR_SELECTOR = ".site-list a.douban";

const extractDoubanId = (href: string) => {
  const match = href.match(/subject\/(\d+)/);
  return match?.[1] ?? null;
};

const ensureContainer = (sidebar: Element) => {
  let container = sidebar.querySelector<HTMLDivElement>(
    RATING_CONTAINER_SELECTOR,
  );

  if (container) {
    return container;
  }

  container = document.createElement("div");
  container.dataset.neodbDoubanRating = "true";
  container.style.lineHeight = "20px";
  // insert at top of sidebar
  sidebar.insertBefore(container, sidebar.firstChild);

  return container;
};


const attachRating = async () => {
  const sidebar = document.querySelector(SIDEBAR_SELECTOR);
  if (!sidebar) return false;

  const existing = sidebar.querySelector(RATING_CONTAINER_SELECTOR);
  if (existing) return true;

  const doubanAnchor = document.querySelector<HTMLAnchorElement>(DOUBAN_ANCHOR_SELECTOR);
  if (!doubanAnchor) return false;

  const doubanId = extractDoubanId(doubanAnchor.href);
  if (!doubanId) return false;

  const container = ensureContainer(sidebar);
  const root = createRoot(container);

  try {
    root.render(
      React.createElement(DoubanRatingCard, {
        doubanUrl: doubanAnchor.href,
        doubanId,
      }),
    );
  } catch (error) {
    console.error("Failed to load Douban rating", error);
    root.render(
      React.createElement(DoubanRatingCard, {
        doubanUrl: doubanAnchor.href,
        doubanId,
      }),
    );
  }

  return true;
};

export const neodbDoubanRating = () => {
  if (!isNeoDBSite()) {
    return;
  }

  const run = async () => {
    // Try immediately if both sidebar and link exist
    const sidebar = document.querySelector(SIDEBAR_SELECTOR);
    const link = document.querySelector(DOUBAN_ANCHOR_SELECTOR);
    if (sidebar && link && (await attachRating())) return;

    const observer = new MutationObserver(async () => {
      const s = document.querySelector(SIDEBAR_SELECTOR);
      const a = document.querySelector(DOUBAN_ANCHOR_SELECTOR);
      if (s && a && (await attachRating())) {
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
