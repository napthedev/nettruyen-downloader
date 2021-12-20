import { API_URL, CONVERSION_API } from "../constants";

import axios from "axios";

export const convertToPDF = async (images, filename = "") => {
  const response = (
    await axios.post(`${CONVERSION_API}/pdf`, {
      urls: images,
      origin: API_URL,
      filename,
    })
  ).data;

  return response;
};
