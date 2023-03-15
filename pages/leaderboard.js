import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from 'next/link'
import Image from "next/image"

function Index() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState(null);

  useEffect(() => {
    const getLeaderBoard = async () => {
      const leaderboard = await fetch(`/api/leaderboard`).then(res => res.json());
      setLeaderboard(leaderboard)
    }
    getLeaderBoard()
  }, [])

 

  if (!leaderboard) return null;

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
                        Leaderboard
                      </h1>
                    </div>
                    <ul>
                    { leaderboard.length ? leaderboard.map(user => {
                        return (
                        // eslint-disable-next-line react/jsx-key, @next/next/link-passhref
                        <Link   href={`/user/${encodeURIComponent(user.userName)}`}>
                        <li style={{cursor: 'pointer'}} key={user.userName} className="flex-col w-full mb-3">
                            <img alt={user.description} className="inline object-cover w-16 h-16 mr-4 rounded-full" src={user.profilePic} />
                            <span>{user.userName} - </span>
                            {/* <span>{user.description}</span> */}
                            <span className="font-bold"><bold>{user.score} tokens</bold></span>
                        </li>
                        </Link>
                        )
                        
                    }): null}
                    </ul>
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
