import config from "../../../config";
import fetch from "node-fetch";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  try {
    const wallet = req.query.wallet;
    const body = {
      jsonrpc: "2.0",
      id: 67,
      method: "qn_fetchNFTs",
      params: {
        wallet: wallet,
        omitFields: ["provenance", "traits"],
        page: 1,
        perPage: 10,
      },
    };

    const allNfts = await fetch(
      "https://sparkling-morning-silence.solana-devnet.discover.quiknode.pro/REMOVED FOR SECURITY/",
      {
        method: "Post",
        headers: {
          accept: "application/json",
          "X-API-Key": config.moralisApiKey,
        },
        body: JSON.stringify(body),
      }
    ).then((res) => res.json());

     
     

    if (allNfts) {
      res.status(200).json({
        allNfts,
      });
    } else {
      throw Error("no data in response");
    }
  } catch (err) {
    console.error("err", err);
    res.send(err);
  }
};
