import config from "../../../config";
import fetch from "node-fetch";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  try {
    const url = `${config.apiBaseUrl}${config.userV2Route}${config.loginURL}`.replace("​", "");
    const mobileNumber =  Number.parseInt(req.query.mobileNumber).toString();
    const userResponse = await fetch(url, {
      method: "post",
      body: JSON.stringify({
        mobileNumber,
        method: "sms",
      }),
      headers: config.apiHeaders,
    }).then((res) => res.json());
    const user = userResponse?.data;
    if (user) {
      res.status(200).json(user);
    } else {
      throw Error("no data in response");
    }
  } catch (err) {
    console.error("err", err);
    res.send(err);
  }
};
