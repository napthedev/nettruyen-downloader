import { PROXY_URL } from "../constants";
import axios from "axios";

export const getChapImages = async (url) => {
  const source = (await axios.get(`${PROXY_URL}/${url}`)).data;

  const parser = new DOMParser();

  const dom = parser.parseFromString(source, "text/html");

  if (!dom.querySelector(".box_doc")) throw new Error("404");

  const result = {
    images: Array.from(dom.querySelectorAll(".box_doc img")).map((img) =>
      img.getAttribute("src").startsWith("//")
        ? img.getAttribute("src").replace("//", "http://")
        : img.getAttribute("src")
    ),
  };

  return result;
};
