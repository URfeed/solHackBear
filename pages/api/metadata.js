import config from "../../config";
import fetch from "node-fetch";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    try {
      const urNft = req.query.address
      // const getWalletsUrl = `${config.moralisSolanaApi}${config.moralisAccountApi}${config.moralisSolanaNetwork}/${req.query.solAddress}/nft`; 
      //  
      // const solanaNfts = await fetch(getWalletsUrl, {
      //   method: "GET",
      //   headers: {
      //     accept: 'application/json',
      //     'X-API-Key': config.moralisApiKey,
      //   },
      // }).then(res => res.json());
      //  
      // const URNFT = solanaNfts.find(nft => nft.symbol === "URNFT");

      // if(!URNFT) throw new Error('No URNFT tokens')
      //  
      const getNftMetaDataUrl = `${config.moralisSolanaApi}${config.moralisNFTApi}${config.moralisSolanaNetwork}/${urNft}/metadata`; 
       
      const nft = await fetch(getNftMetaDataUrl, {
          method: "GET",
          headers: {
            accept: 'application/json',
            'X-API-Key': config.moralisApiKey,
          },
      }).then(res => res.json());

       

      if (nft) {
        res.status(200).json({
            nft
        });
      } else {
        throw Error("no data in response");
      }
    } catch (err) {
      console.error("err", err);
      res.send(err);
    }
};