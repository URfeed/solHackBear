import Head from "next/head";
import Login from "../components/login";

export default function Home() {
  return (
    <div className="h-screen  w-screen items-center justify-center align-middle">

      <Head>
        <title>Connect to Earn | urFeed</title>
        <meta name="description" content="A basic tutorial of Moralis IO" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Login />
    </div>
  );
}
