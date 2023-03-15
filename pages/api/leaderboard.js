import config from "../../config";
import fetch from "node-fetch";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  try {
    const url = `${config.apiBaseUrl}${config.apiV2}${config.achievement}${config.leaderboard}`.replace("​", "");
    const leaderboardResponse = await fetch(url, {
      headers: {
        ...config.apiHeaders,
      }
    }).then((res) => res.json());
    const leaderboard = leaderboardResponse?.data;
    if (leaderboard) {
      res.status(200).json(leaderboard);
    } else {
      throw Error("no data in response");
    }
  } catch (err) {
    console.error("err", err);
    res.send(err);
  }
};