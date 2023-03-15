/* eslint-disable react/jsx-no-comment-textnodes */
import Image from "next/image";
import { useRouter } from "next/router";
import Link from 'next/link'
import { useEffect, useState } from "react";
import config from "../config";
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  Metaplex,
  bundlrStorage,
  keypairIdentity,
} from "@metaplex-foundation/js";
import ProgressTracker from "./progressTracker";
const logo = "/Logomark.png";



const host = config.host;

function Dashboard() {
  const [state, setState] = useState({});
  const [solAddress, setSolAddress] = useState({});
  const [nft, setNFT] = useState({});
  const [QRImg, setQRImg] = useState(null);
  const [user, setUser] = useState({});
  const router = useRouter();

  useEffect(() => {
    const getUserAndWallet = async () => {
      const user = await fetch(`/api/auth/wallet`).then((res) => res.json());
       
      setUser(user);
       
      const wallet = user?.wallet?.find((wallet) => wallet.type === "sol");
      if (wallet?.address) {
        setSolAddress(wallet.address);
        const nft = await fetch(
          `/api/nft/urnftViaWallet?address=${wallet.address}`
        ).then((res) => res.json());
         
        const IPFSImgMeta = await fetch(nft?.nft?.metaplex?.metadataUri).then(
          (res) => res.json()
        )
        setQRImg(IPFSImgMeta?.image);
        setNFT(nft?.nft);
      }
    };
    getUserAndWallet();
  }, []);
   
  if (!user) return null;
  return (
    <div>
      <div className="right-0 flex flex-row content-end">
        <div className="pl-6 pt-8 lg:pl-10  ">
          <div className="float-left">
            <a rel="noreferrer" href="https://urfeed.xyz/" target="_blank">
              <Image alt="logo" src={logo} width={32} height={32} />
            </a>
          </div>
          <h1 className="text-white float-left ml-2 text-xl">Feed</h1>
        </div>
        <button
          // onClick={logout}
          className="px-5 py-3 text-xl rounded-xl bg-opacity-0  border border-white border-opacity-10 ml-auto mr-5 mt-5 hover:bg-primary-600 hover:bg-opacity-100 hover:text-buttontext"
        >
          Logout
        </button>
      </div>

      <section>
        <div className="pt-20 pb-10  radius-for-skewed">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8 p-6 flex flex-wrap items-center colourLight rounded-lg shadow">
                <div className="w-full lg:w-1/3">
                  <div></div>
                  {QRImg && (
                    <Image
                      src={QRImg}
                      alt="Picture of the author"
                      width={500}
                      height={500}
                    />
                  )}
                </div>
                <div className="w-full lg:w-2/3">
                  <div className="max-w-lg mx-auto">
                    <div className="flex items-center justify-between mb-8"></div>

                    <p className="text-3xl text-center">
                      You have earnt <br />{" "}
                      <span className="text-6xl">{user?.points} points </span>
                    </p>
                    <p className="text-xl text-center my-6">
                      Earn more by, signing up new users via your urID page, getting users to follow you and follow others users. 
                    </p>

                    <div className="flex w-full items-center justify-items-center">
                    <Link href={`/user/${encodeURIComponent(user?.userName)}`}>
                    <button className="bg-violet-400 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded mb-4 mr-6">
              Visit urID page
            </button>
            </Link>
            <Link href={`/leaderboard`}>
            <button className="bg-violet-400 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded mb-4">
              Points leaderboard
            </button>
            </Link>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {user?.points && solAddress? (
      <div className="relative items-center flex flex-col">
        
        <ProgressTracker userScore={user.points} targetNumber={300} solAddress={solAddress}/>
      </div>
  ) : null }

      {/* <div className="relative items-center flex flex-col">
        <button
          onClick={openCamera}
          className="px-5 py-3 mb-3 text-xl text-buttontext w-[80%] self-center rounded-xl bg-primary-600 "
        >
          Camera
        </button>
      </div> */}
    </div>
  );
}

export default Dashboard;
