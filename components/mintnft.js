const mintcta = async (event) => {
    fetch(`api/create-nft?publicKey=${solAddress}`)
    .then((res) => res.json())
    .then((data) => {
      
      router.push('/dashboard')
    })
}
function mint ({solAddress}) {
    // const { data } = useMoralisQuery("nft", query =>
    // query
    // .equalTo("publicKey", solAddress)
    // );

    return (
        <button
        onClick={mintcta(solAddress)}
        className="px-7 py-4 text-xl rounded-xl bg-green-300"
        >Mint NFT to {solAddress}
        </button>
        )
      }
export default mint 
