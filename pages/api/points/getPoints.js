import config from "../../../config";
import fetch from "node-fetch";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  try {
    const url = `${config.apiBaseUrl}${config.userV2Route}${config.achievement}${config.points}`.replace("​", "");
    const pointsResponse = await fetch(url, {
      headers: {
        ...config.apiHeaders,
        auth_token: req.cookies.authToken,
      }
    }).then((res) => res.json());
    const points = pointsResponse?.data;
    if (points) {
      res.status(200).json(points);
    } else {
      throw Error("no data in response");
    }
  } catch (err) {
    console.error("err", err);
    res.send(err);
  }
};
