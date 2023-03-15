import config from "../../../config";
import fetch from "node-fetch";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  if (req.method === 'POST') {
    try {
      const userWalletUrl = `${config.apiBaseUrl}${config.apiV2}${config.userURL}${config.wallet}`;
      //  
      const userWalletResponse = await fetch(userWalletUrl, {
        method: "POST",
        body: JSON.stringify({
          type: "sol",
          address: req.query.solAddress,
          signature: req.query.signature,
          provider: "Solana",
          providerIcon: "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/sqzgmbkggvc1uwgapeuy",
          network: "devNet"
        }),
        headers: {
          ...config.apiHeaders,
          auth_token: req.cookies.authToken,
        },
      }).then(res => res.json());
       
      const wallet = userWalletResponse?.data
       

      if (wallet) {
        res.status(200).json({
          wallet
        });
      } else {
        throw Error(userWalletResponse.message);
      }
    } catch (err) {
      console.error("err", err);
      res.send(err);
    }

  } else {
    try {
      const userUrl = `${config.apiBaseUrl}${config.apiV2}${config.userURL}`;
      const userWalletUrl = `${config.apiBaseUrl}${config.apiV2}${config.userURL}${config.wallet}`;
       
      const userResponse = await fetch(userUrl, {
        method: "GET",
        headers: {
          ...config.apiHeaders,
          auth_token: req.cookies.authToken,
        },
      }).then(res => res.json());
       
      const user = userResponse?.data

       

      const userWalletResponse = await fetch(userWalletUrl, {
          method: "GET",
          headers: {
            ...config.apiHeaders,
            auth_token: req.cookies.authToken,
          },
      }).then(res => res.json());
      const wallet = userWalletResponse?.data

      const pointsUrl = `${config.apiBaseUrl}${config.apiV2}${config.achievement}${config.points}`.replace("​", "");
      const pointsResponse = await fetch(pointsUrl, {
        headers: {
          ...config.apiHeaders,
          auth_token: req.cookies.authToken,
        }
      }).then((res) => res.json());
      const points = pointsResponse?.data;

       

      if (user) {
        res.status(200).json({
          ...user,
          wallet,
          points: points[0]?.total
        });
      } else {
        throw Error("no data in response");
      }
    } catch (err) {
      console.error("err", err);
      res.send(err);
    }
  }
};