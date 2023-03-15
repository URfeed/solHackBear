import config from "../../../config";
import fetch from "node-fetch";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    try {
      const userUrl = `${config.apiBaseUrl}${config.apiV1}${config.profile}`;

      const userResponse = await fetch(userUrl, {
        method: "POST",
        body: JSON.stringify({
            isLogin: 0,
            userId: req.query.userId
        }),
        headers: {
          ...config.apiHeaders,
          auth_token: req.cookies.authToken || config.apiHeaders.auth_token,
        },
      }).then(res => res.json());

      const user = userResponse?.data

      if (user) {
        res.status(200).json({
          ...user,
          wallet
        });
      } else {
        throw Error("no data in response");
      }
    } catch (err) {
      console.error("err", err);
      res.send(err);
    }
};