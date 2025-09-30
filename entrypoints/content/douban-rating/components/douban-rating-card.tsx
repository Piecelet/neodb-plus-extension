import React, { useEffect, useMemo, useState } from "react";
import type { FrodoSubjectResponse } from "@/entrypoints/shared/douban-rating";
import { getDoubanRatingService } from "@/entrypoints/shared/douban-rating";
import { Stars } from "./star";
import { BarRow } from "./bar-row";

const formatCount = (count?: number) =>
  typeof count === "number" ? new Intl.NumberFormat("zh-CN").format(count) : undefined;

const doubanRatingService = getDoubanRatingService();

const fetchDoubanRating = (doubanId: string) =>
  doubanRatingService.fetchDoubanRating({ doubanId });

const fetchDoubanDistribution = (url: string) =>
  doubanRatingService.fetchDoubanDistribution({ url });

export const DoubanRatingCard: React.FC<{
  doubanUrl: string;
  doubanId: string;
}> = ({ doubanUrl, doubanId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState<FrodoSubjectResponse["rating"] | undefined>(
    undefined,
  );
  const [distribution, setDistribution] = useState<number[] | undefined>(
    undefined,
  );

  useEffect(() => {
    let alive = true;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const [ratingResp, distResp] = await Promise.all([
          fetchDoubanRating(doubanId),
          fetchDoubanDistribution(doubanUrl),
        ]);
        if (!alive) return;
        setRating(ratingResp?.rating);
        setDistribution(distResp?.distribution);
      } catch (e) {
        if (!alive) return;
        setError("error");
      } finally {
        if (alive) setLoading(false);
      }
    };
    void run();
    return () => {
      alive = false;
    };
  }, [doubanId, doubanUrl]);

  const avg = rating?.value ?? 0;
  const count = formatCount(rating?.count);
  const rows = useMemo(() => distribution ?? [], [distribution]);
  return (
    <div style={{ paddingBlockEnd: 8, borderBottom: "1px solid #eee", marginBlockEnd: 8 }}>
      <div style={{ color: "#9e9e9e", fontSize: 13, marginBottom: 6 }}>
        豆瓣评分{loading ? "加载中…" : error ? "获取失败" : ""}
      </div>
      {loading || error ? null : (
        <>
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
        </>
      )}
    </div>
  );
};
