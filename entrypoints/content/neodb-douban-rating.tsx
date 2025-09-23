import { defineExtensionMessaging } from "@webext-core/messaging";
import React, { useMemo } from "react";
import { createRoot } from "react-dom/client";

import type { FrodoSubjectResponse, MessagingProtocolMap } from "../shared/douban-rating";

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
  container.style.marginTop = "8px";
  container.style.fontSize = "14px";
  container.style.lineHeight = "20px";
  container.style.color = "var(--np-secondary-text, #5f6368)";
  // insert at top of sidebar
  sidebar.insertBefore(container, sidebar.firstChild);

  return container;
};

const formatCount = (count?: number) =>
  typeof count === "number" ? new Intl.NumberFormat("zh-CN").format(count) : undefined;

const messaging = defineExtensionMessaging<MessagingProtocolMap>();

const fetchDoubanRating = (doubanId: string) =>
  messaging.sendMessage("fetch-douban-rating", { doubanId });

const fetchDoubanDistribution = (url: string) =>
  messaging.sendMessage("fetch-douban-distribution", { url });

const Star: React.FC<{ fill: number }> = ({ fill }) => {
  const pct = Math.max(0, Math.min(1, fill)) * 100;
  const color = "#ffa726"; // orange
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" style={{ display: "inline-block" }}>
      <defs>
        <linearGradient id={`g-${pct}`} x1="0" y1="0" x2="100%" y2="0">
          <stop offset={`${pct}%`} stopColor={color} />
          <stop offset={`${pct}%`} stopColor="#e0e0e0" />
        </linearGradient>
      </defs>
      <path
        d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.402 8.168L12 18.896l-7.336 3.869 1.402-8.168L.132 9.21l8.2-1.192z"
        fill={`url(#g-${pct})`}
      />
    </svg>
  );
};

const Stars: React.FC<{ value: number }> = ({ value }) => {
  // Convert 0..10 to 0..5 scale
  const s = Math.max(0, Math.min(10, value)) / 2;
  const stars = Array.from({ length: 5 }).map((_, i) => (
    <Star key={i} fill={Math.max(0, Math.min(1, s - i))} />
  ));
  return <div style={{ display: "flex", gap: 0 }}>{stars}</div>;
};

const MAX_BAR_PX = 100;

const BarRow: React.FC<{ label: string; percent?: number }> = ({ label, percent }) => {
  const p = typeof percent === "number" ? percent : 0;
  const widthPx = Math.round(Math.max(0, Math.min(100, p)) * (MAX_BAR_PX / 100));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
      <div style={{ color: "#777", fontSize: 12, lineHeight: "14px", textAlign: "right" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ height: 10, width: `${widthPx}px`, background: "#ffcc80", borderRadius: 2 }} />
        <div style={{ color: "#777", fontSize: 12, lineHeight: "14px" }}>{p ? `${p.toFixed(1)}%` : ""}</div>
      </div>
    </div>
  );
};

const DoubanRatingCard: React.FC<{
  doubanUrl: string;
  rating?: FrodoSubjectResponse["rating"];
  distribution?: number[]; // 5->1
}> = ({ doubanUrl, rating, distribution }) => {
  const avg = rating?.value ?? 0;
  const count = formatCount(rating?.count);
  const rows = useMemo(() => distribution ?? [], [distribution]);
  return (
    <div style={{ padding: "8px 0 12px", borderBottom: "1px solid #eee" }}>
      <div style={{ color: "#9e9e9e", fontSize: 13, marginBottom: 6 }}>豆瓣评分</div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: "2rem", fontWeight: 600, color: "#333" }}>{avg ? avg.toFixed(1) : "-"}</div>
        <div>
          <Stars value={avg} />
          {count ? (
            <a href={doubanUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "90%" }}>
              {count}人评价
            </a>
          ) : null}
        </div>
      </div>
      {rows.length === 5 ? (
        <div style={{ marginTop: 8 }}>
          <BarRow label="5星" percent={rows[0]} />
          <BarRow label="4星" percent={rows[1]} />
          <BarRow label="3星" percent={rows[2]} />
          <BarRow label="2星" percent={rows[3]} />
          <BarRow label="1星" percent={rows[4]} />
        </div>
      ) : null}
    </div>
  );
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
  container.textContent = "豆瓣评分加载中…";

  try {
    const [ratingResp, distResp] = await Promise.all([
      fetchDoubanRating(doubanId),
      fetchDoubanDistribution(doubanAnchor.href),
    ]);

    const root = createRoot(container);
    root.render(
      React.createElement(DoubanRatingCard, {
        doubanUrl: doubanAnchor.href,
        rating: ratingResp?.rating,
        distribution: distResp?.distribution,
      }),
    );
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
