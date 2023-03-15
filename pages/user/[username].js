import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
// import { useMoralis, useMoralisFile } from "react-moralis";
import Link from "next/link";
import AllNfts from "../../components/nfts";

function Index() {

  const [profile, setProfile] = useState(null);
  const [QRImg, setQRImg] = useState(null);

  const router = useRouter();
  const username = router.query.username;

  useEffect(() => {
    if (username && !profile) {
      const getUser = async () => {
        if (!profile?.user) {
          const profileFetch = await fetch(
            `/api/user/getUserProfile?userName=${username}`
          ).then((res) => res.json());
          setProfile(profileFetch.user);
        }
      };
      getUser();
    }
    if (profile && !QRImg) {
       
      const getUrNft = async () => {
        const nft = await fetch(
          `/api/nft/urnft?address=${profile.urNft}`
        ).then((res) => res.json());
         
        const IPFSImgMeta = await fetch(nft?.nft?.metaplex?.metadataUri).then(
          (res) => res.json()
        );
        setQRImg(IPFSImgMeta?.image);
      };
      getUrNft();
    }

    // eslint-disable-next-line import/no-anonymous-default-export
  }, [username, profile]);

  const unfollow = async ()=> {
    try {
      const followUser = await fetch(`/api/user/unfollow/${profile.userId}`, {
        method: 'POST'
      }).then(res => res.json());
      if (followUser) {
        const updateProfile = { ...profile, follow: false}
        setProfile(updateProfile)
      }
    } catch(err) {
      console.error('Error: ', err)
    }
  }

  const follow = async ()=> {
    try {
      const followUser = await fetch(`/api/user/follow/${profile.userId}`, {
        method: 'POST'
      }).then(res => res.json());
      if (followUser) {
        const updateProfile = { ...profile, follow: true}
        setProfile(updateProfile)
      }
    } catch(err) {
      console.error('Error: ', err)
    }
  }

  const signup = ()=> {
    //clear cookies
    router.push(`/?refererUserId=${profile.userId}&refererUserName=${profile.userName}`);
  }

   
  if (!profile?.userName && !QRImg) return null;
  return (
    <div className="w-screen flex flex-col items-center justify-center">
      <Head>
        <title>Connect to Earn | urFeed</title>
      </Head>

      <section className="flex font-medium items-center w-full max-w-screen-lg">
        <section className="mx-auto grow rounded-2xl px-8 py-6 shadow-lg mr-4 justify-self-stretch">
          {profile && profile.userName ? (
            <div className="flex">
              <div>
                <Image
                  className="rounded-full border-4 border-white"
                  src={profile.profilePic}
                  alt="Picture of the author"
                  width={140}
                  height={140}
                />
              </div>
              <div>
                <span className="text-4xl">{profile.userName}</span>
              </div>
            </div>
          ) : null}
          <AllNfts wallet={profile.solanaWallet}/>
        </section>

        <section className="w-64 mx-auto rounded-2xl px-8 py-6 shadow-lg">
          <div className="flex items-center justify-between">
            {profile.follow === false ? (
            <button onClick={follow} className="bg-violet-400 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded mb-4">
              Follow to connect
            </button>
            ) : null }
            {profile.follow === true ? (
            <button onClick={unfollow} className="bg-violet-400 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded mb-4">
              Unfollow
            </button>
            ) : null }
            {profile.follow === "Not logged in" ? (
            <button onClick={signup} className="bg-violet-400 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded mb-4">
              Sign up to follow
            </button>
            ) : null }
          </div>
          {QRImg ? (
            <Image
              src={QRImg}
              alt="Picture of the author"
              width={500}
              height={500}
            />
          ) : null}
        </section>
      </section>
    </div>
  );
}

export default Index;
