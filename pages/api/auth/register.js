import config from "../../../config";
import fetch from "node-fetch";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  try {
    const url = `${config.apiBaseUrl}${config.userV2Route}${config.registerURL}`.replace("​", "");

    const userResponse = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        mobileNumber: req.query.mobileNumber,
        userName: req.query.userName,
        method: "sms",
      }),
      headers: config.apiHeaders,
    }).then((res) => res.json());

    const user = userResponse?.data;
    if (user) {
      res.status(200).json(user);
    } else {
      throw userResponse;
    }
  } catch (err) {
    console.error("err", err);
    res.send(err);
  }
};