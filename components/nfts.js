import Image from "next/image";
import { useEffect, useState } from "react";

const Nft = ({ wallet }) => {
  const [allNfts, setAllNfts] = useState();

  useEffect(() => {
    const getNfts = async () => {
      const allNftsFetch = await fetch(`/api/nft/allNfts?wallet=${wallet}`, {
        method: "GET",
      }).then((res) => res.json());
       
      setAllNfts(allNftsFetch.allNfts);
       
    };
    

    getNfts();
  }, []);

  if (!allNfts) return null;
  if (allNfts)  

  return (
    <div className="p-4">
      <h1>NFTs</h1>
      <div className="grid grid-cols-4 gap-4">
        {allNfts.result?.assets.map((nft) => (
          <div
            key={nft.tokenAddress}
            className="rounded overflow-hidden shadow-lg"
          >
            <a
              target="_blank"
              href={`https://solscan.io/token/${nft.tokenAddress}?cluster=devnet`}
              rel="noopener noreferrer"
            >
              <Image
                className="w-full"
                src={nft.imageUrl}
                alt={nft.description}
                height={200}
                width={200}
              />
            </a>
            <div className="px-6 py-4">
              <div className="font-bold text-xs mb-2 truncate">{nft.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Nft;
