import Head from "next/head";
import Dashboard from "../../components/dashboard";


function Index() {  
  return (
    <div className="h-screen  w-screen items-center justify-center align-middle">
    <Head>
      <title>Connect to Earn | urFeed</title>
    </Head>
   <Dashboard />
   </div>
  );
}

export default Index;

