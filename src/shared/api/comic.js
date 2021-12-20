import { API_URL, PROXY_URL } from "../constants";

import axios from "axios";

export const getComicInfo = async (comicId) => {
  const source = (
    await axios.get(`${PROXY_URL}/${API_URL}/truyen-tranh/${comicId}`)
  ).data;

  const parser = new DOMParser();

  const dom = parser.parseFromString(source, "text/html");

  if (!dom.querySelector("#item-detail .title-detail")?.textContent)
    throw new Error("404");

  const result = {
    title: dom.querySelector("#item-detail .title-detail")?.textContent,
    cover: dom
      .querySelector("#item-detail .detail-info img")
      ?.getAttribute("src")
      ?.replace("//", "http://"),
    chapters: Array.from(
      dom.querySelectorAll(".list-chapter ul li:not(.heading)")
    )
      .map((li) => ({
        title: li.querySelector(".chapter a")?.textContent,
        url: li.querySelector(".chapter a")?.getAttribute("href"),
      }))
      .reverse(),
  };

  return result;
};
