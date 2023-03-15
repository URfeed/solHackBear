import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  Metaplex,
  bundlrStorage,
  keypairIdentity,
} from "@metaplex-foundation/js";
// import Moralis from "moralis/node";
import config from "../../config";
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
// const ipfs = create('https://ipfs.infura.io:5001')

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
      const userName = req.query.userName;
      const refererUserId = req.query.refererUserId;
      if (!publicKey) throw new Error('missing public key')
      if (!userName || userName === 'undefined') throw new Error('missing userName')
  

    const body = {
      size: 500,
      colorDark: "rgb(91,14,158)",
      logo: "https://urfeed.xyz/urFeed-logo.png",
      eye_outer: "eyeOuter1",
      eye_inner: "eyeInner1",
      qrData: "pattern0",
      backgroundColor: "rgb(255,255,255)",
      frameColorType: "linear",
      transparentBkg: false,
      qrCategory: "url",
      text: config.host + "user/" + userName,
      frame: 16,
      gradient: true,
      grdType: 0,
      color01: "#310580",
      color0: "#8f05f3",
      qrFormat: "png",
      frameColor1: "rgb(5,64,128)",
      frameColor2: "rgb(58,116,197)",
      frameGradientEndColor: "rgb(143,5,243)",
      frameGradientStartColor: "rgb(49,5,128)",
      frameText: "Connect to earn",
    };

    const qrcode = await fetch("https://qrtiger.com/api/qr/static", {
      method: "POST",
      headers: {
        Authorization: "Bearer REMOVED FOR SECURITY",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((res) => res.json());

    const qrCodeArrBuffer = Buffer.from(qrcode.data, "base64");
    const img = await ipfs.add(qrCodeArrBuffer);

    const randomNumber = Math.floor(Math.random() * 1000000000);
    const name = `Urfeed #${randomNumber}`;

    const imgPath = img.path;

    const meta = {
      name: `${name}`,
      symbol: "URNFT",
      description: "urFeed Profile NFT",
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
      symbol: "URNFT",
      name,
      tokenOwner,
    });

     

    const editBody = {
      urNft: nft.mint.address.toBase58(),
    };

    const editUserUrl = `${config.apiBaseUrl}${config.apiV1}/editUserProfile`;

    const userResponse = await fetch(editUserUrl, {
      method: "POST",
      headers: {
        ...config.apiHeaders,
        auth_token: req.cookies.authToken,
      },
      body: JSON.stringify(editBody),
    }).then((res) => res.json());

     

    const addSignupPoints = `${config.apiBaseUrl}${config.apiV2}${config.achievement}${config.signup}`.replace("​", "");
    await fetch(addSignupPoints, {
      method: "POST",
      headers: {
        ...config.apiHeaders,
        auth_token: req.cookies.authToken,
      }
    }).then((res) => res.json());

     

     
    // if (refererUserId && refererUserId !== "undefined") {
    //   const onboardingPointsUrl = `${config.apiBaseUrl}${config.apiV2}${config.achievement}${config.onboarding}`.replace("​", "");
    //    
    //   await fetch(onboardingPointsUrl, {
    //     method: "POST",
    //     body: JSON.stringify({
    //       userId: refererUserId
    //     }),
    //     headers: {
    //       ...config.apiHeaders,
    //       auth_token: req.cookies.authToken,
    //     }
    //   }).then((res) => res.json());

    // }

     

    res.send({ nft });
  } catch (err) {
     
    res.status(400);
    return res.send({ err });
  }
};
export default CreateNFT;
