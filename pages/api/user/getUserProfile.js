import config from "../../../config";
import fetch from "node-fetch";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    try {
       
      const userUrl = req.query.userName ? `${config.apiBaseUrl}${config.userV2Route}?userName=${req.query.userName}` : `${config.apiBaseUrl}${config.apiV1}${config.profile}`;
       
      const userResponse = await fetch(userUrl, {
        method: "GET",
        headers: {
          ...config.apiHeaders,
          auth_token: req.cookies.authToken || config.apiHeaders.auth_token,
        },
      }).then(res => res.json());

      const user = userResponse?.data
       

      if (userResponse) {
        res.status(200).json({
            user
        });
      } else {
        throw Error("no data in response");
      }
    } catch (err) {
      console.error("err", err);
      res.send(err);
    }
};