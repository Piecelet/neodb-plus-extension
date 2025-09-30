import type { FrodoSubjectResponse } from "@/entrypoints/shared/douban-rating";
import { registerDoubanRatingService } from "@/entrypoints/shared/douban-rating";

const API_BASE = "https://frodo.douban.com/api/v2/subject";
const API_KEY = "0ac44ae016490db2204ce0a042db2916";
// UA 和 Referer 通过 webRequest 在 background 中统一伪装

export const registerDoubanRatingHandler = () => {
  registerDoubanRatingService({
    async fetchDoubanRating({ doubanId }) {
      if (!doubanId) {
        throw new Error("Missing Douban subject id");
      }

      const requestUrl = `${API_BASE}/${doubanId}?apiKey=${API_KEY}`;
      // 伪装 UA/Referer 在 webRequest 中进行，这里不直接设置受限头
      const response = await fetch(requestUrl);

      if (!response.ok) {
        throw new Error(`Douban rating request failed: ${response.status}`);
      }

      const payload = (await response.json()) as FrodoSubjectResponse;
      return payload;
    },
    async fetchDoubanDistribution({ url }) {
      if (!url) return { distribution: undefined };
      const res = await fetch(url, {
        // Reuse UA/Referer spoofing via header interceptors
        credentials: "omit",
        cache: "no-store",
      });
      if (!res.ok) return { distribution: undefined };
      const html = await res.text();
      const matches = [...html.matchAll(/<span class=\"rating_per\">(\d+(?:\.\d+)?)%<\/span>/g)]
        .map((m) => parseFloat(m[1]))
        .slice(0, 5);
      // Douban order is 5★ to 1★
      if (matches.length === 5) {
        return { distribution: matches as number[] };
      }
      return { distribution: undefined };
    },
  });
};
