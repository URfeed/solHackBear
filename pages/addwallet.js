import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import bs58 from "bs58";

function Index() {
  const router = useRouter();

  const refererUserId = router.query.refererUserId;
  const refererUserName = router.query.refererUserName;
  const [solAddress, setSolAddress] = useState(null);
  const [signature, setSignature] = useState(null);
  const [user, setUser] = useState(null);
  const [minted, setMinted] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [connectButton, setConnectButton] = useState('Connect to phantom wallet');

  useEffect(() => {
    const getUserAndWallet = async () => {
      const user = await fetch(`/api/auth/wallet`).then(res => res.json());
      setUser(user)
      const wallet = user.wallet?.find(wallet => wallet.type === "sol");
      if(wallet?.address) {
        setSolAddress(wallet.address);
      }
    }
    getUserAndWallet()
  }, [])

  const handleFindWalletAddress = async () => {
    if (typeof window != undefined) {
      const wallet = await window.solana.connect()
       
      const solAddress = wallet.publicKey.toString()
      if (solAddress) setConnectButton('Sign message in wallet')
      const signedMessage = await window.solana.signMessage(
        new TextEncoder().encode(user.userId),
        "utf8"
      );
      const signature = bs58.encode(signedMessage.signature);
      setSignature(signature)
      setSolAddress(solAddress)
    }
  }

  const handleError = (response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    } else {
      return response.json();
    }
  };

  const mint = async () => {
   try {
      setLoading(true);
      // add public address to user
      const userWallet = await fetch(`/api/auth/wallet?solAddress=${solAddress}&signature=${signature}`, {
        method: 'POST'
      }).then(res => res.json());
       

      fetch(`api/create-nft?publicKey=${solAddress}&userName=${user.userName}&refererUserId=${refererUserId}`, {
        method: "POST",
      })
      .then(handleError)
      .then(() => {
        setMinted(true)
        if (refererUserName) {
          router.push(`/user/${refererUserName}`);
        } else {
          router.push("/dashboard");
        }
      })
    } catch(err) {
      console.error('Error: ', err)
    }
  };

  if (!user) return null;

  return (
    <div className="h-screen  w-screen items-center justify-center align-middle">
      <Head>
        <title>Connect to Earn | urFeed</title>
      </Head>
      <div>
        <section className="">
          <div className="w-screem h-screen  ">
            <div className=" items-stretch justify-items-stretch w-full  lg:flex h-full flex-col  rounded-2xl ">
              <div className="w-full h-full lg:max-w-lg self-center lg:h-90 align-middle justify-center colourLight">
                <div className=" pt-8 px-6 self-center  sm:px-20 pb-24 sm:pb-44   shadow">
                  <div className="max-w-md min-w-full ">
                    <div>
                      <h1 className="text-4xl mb-5 text-center">
                        {minted
                          ? `You've minted your NFT, go to dashboard.`
                          : `Create your Connect to Earn NFT?`}{" "}
                      </h1>
                    </div>
                    {
                      minted ? ( // if has image
                        <p className="break-words width-100 mb-5">
                          {" "}
                          {solAddress}{" "}
                        </p> // return My image tag
                      ) : (
                        <>
                            <label className="text-xl mb-5">
                              The NFT will be sent to this address so will all
                              future earnings via connections.{" "}
                            </label>
                            <label>Solana Wallet Address: {solAddress}{" "}</label>
                            
                            <button
                              onClick={handleFindWalletAddress}
                              className="px-5 py-3 mb-3 mt-3 text-xl text-buttontext min-w-full rounded-xl bg-violet-400 hover:bg-violet-600"
                            > 
                            {connectButton}
                            </button>
                            <button
                              onClick={mint}
                              className="px-5 py-3 mb-3 mt-3 text-xl text-buttontext min-w-full disabled:opacity-50 rounded-xl bg-violet-400 hover:bg-violet-600"
                              type="submit"
                              disabled={!solAddress && !signature}
                            >
                              {isLoading ? "Minting..." : "Mint"}
                            </button>
                        </>
                      ) // otherwise return other element
                    }

                    {minted ? ( // if has image
                      <div className="relative items-center flex flex-col">
                        <button
                          onClick={() => router.push("/dashboard")}
                          className="px-5 py-3 mb-3 mt-3 text-xl text-buttontext min-w-full rounded-xl bg-primary-600"
                        >
                          Dashboard
                        </button>
                      </div> // return My image tag
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Index;
