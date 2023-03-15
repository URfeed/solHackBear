import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  Metaplex,
  bundlrStorage,
  keypairIdentity,
} from "@metaplex-foundation/js";
// import Moralis from "moralis/node";
import config from "../../../config";
import fetch from "node-fetch";       
import { create, urlSource, globSource } from "ipfs-http-client";

const auth = Buffer.from(
  "REMOVED FOR SECURITY" + ":" + "REMOVED FOR SECURITY"
).toString("base64");

const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: "Basic " + auth,
  },
});

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const secretKey = Uint8Array.from(config.masterWallet);
const keypair = Keypair.fromSecretKey(secretKey);
const metaplex = Metaplex.make(connection)
  .use(keypairIdentity(keypair))
  .use(bundlrStorage());

const defaultPoints = 10;
const defaultEnergy = 20;
const defaultLuck = 80;

const CreateNFT = async (req, res) => {
  try {
    const publicKey = req.query.publicKey;
    const img = await ipfs.add(urlSource('https://urfeed-stag.s3.eu-west-2.amazonaws.com/nfts/p3ople/5.jpg'));
    const randomNumber = Math.floor(Math.random() * 1000000);
    const name = `p3ople #${randomNumber}`;

    const imgPath =  img.cid.toString();

     

    const meta = {
      name: `${img.path}`,
      symbol: "URP",
      description: "P3ople NFT",
      image: `https://ipfs.io/ipfs/${imgPath}`,
      attributes: [
        {
          trait_type: "energy",
          value: `${defaultEnergy}`,
        },
        {
          trait_type: "luck",
          value: `${defaultLuck}`,
        },
      ],
      properties: {
        creators: [{ address: keypair.publicKey, share: 100 }],
        files: [{ uri: imgPath, type: "image/png" }],
      },
    };

    const metaCID = await ipfs.add(new Buffer(JSON.stringify(meta)));
    const metaUrl = `https://ipfs.io/ipfs/${metaCID.path}`;

     

    const tokenOwner = new PublicKey(`${req.query.publicKey}`);

     

    const { nft } = await metaplex.nfts().create({
      uri: metaUrl,
      symbol: "URP",
      name,
      tokenOwner,
    });

     

    res.send({ nft });
  } catch (err) {
    res.status(400);
    return res.send({ err });
  }
};
export default CreateNFT;
