import React, { useState, useEffect } from 'react';

const ProgressTracker = ({ targetNumber, userScore, solAddress }) => {
   
  const [currentNumber, setCurrentNumber] = useState(userScore);
  const [remaining, setRemaining] = useState(userScore);
  const [progress, setProgress] = useState(0);
  const [showButton, setShowButton] = useState(false);
  

  useEffect(() => {
     
    const newProgress = (currentNumber / targetNumber) * 100;
    setRemaining(targetNumber - currentNumber)
    setProgress(newProgress);

    if (newProgress >= 100) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, [currentNumber, targetNumber]);

  const mintP3ople = async () => {
    try {
      const mintNft = await fetch(`/api/nft/mintpeople?publicKey=${solAddress}`, {
        method: 'POST'
      }).then(res => res.json());
      if (mintNft) {
        alert("Mint complete")
      }
    } catch(err) {
      console.error('Error: ', err)
    }
  }

  return (
    <div className='w-7/12 text-center'>
      {/* <p>Current Number: {currentNumber}</p>
      <p>Target Number: {targetNumber}</p>
      <p>Progress: {progress.toFixed(2)}%</p> */}
      {!showButton && <div style={{ width: '100%', height: '40px', backgroundColor: '#ddd' }}>
        <div
        className='bg-violet-400'
          style={{
            width: `${progress}%`,
            height: '100%',
          }}
        ></div>
      </div>
}
      {showButton && <button onClick={mintP3ople} className="bg-violet-400 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded mb-4">
              Mint p3ople NFT
            </button>}
      {!showButton && <span className='w-full text-center block'>You need another {remaining} points to mint p3ople NFt</span>}
    </div>
  );
};

export default ProgressTracker;