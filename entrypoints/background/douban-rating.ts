import { onMessage } from "webext-bridge/background";

import type { FrodoSubjectResponse } from "../shared/douban-rating";

type FetchDoubanRatingPayload = {
  doubanId: string;
};

const API_BASE = "https://frodo.douban.com/api/v2/subject";
const API_KEY = "0ac44ae016490db2204ce0a042db2916";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF XWEB/8391";
const REFERER =
  "https://servicewechat.com/wx2f9b06c1de1ccfca/99/page-frame.html";
const BID_LENGTH = 11;
const BID_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-";

const generateBid = () => {
  let bid = "";
  for (let i = 0; i < BID_LENGTH; i += 1) {
    const index = Math.floor(Math.random() * BID_CHARSET.length);
    bid += BID_CHARSET[index];
  }
  return bid;
};

export const registerDoubanRatingHandler = () => {
  onMessage<FetchDoubanRatingPayload, FrodoSubjectResponse | undefined>(
    "fetch-douban-rating",
    async ({ data }) => {
      const { doubanId } = data;
      if (!doubanId) {
        throw new Error("Missing Douban subject id");
      }

      const requestUrl = `${API_BASE}/${doubanId}?apiKey=${API_KEY}`;
      const response = await fetch(requestUrl, {
        headers: {
          "user-agent": USER_AGENT,
          referer: REFERER,
          cookie: `bid=${generateBid()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Douban rating request failed: ${response.status}`);
      }

      const payload = (await response.json()) as FrodoSubjectResponse;
      return payload;
    },
  );
};
