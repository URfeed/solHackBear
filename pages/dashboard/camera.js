import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import config from "../../config";

import { QrScanner } from "@yudiel/react-qr-scanner";

function Camera() {
  const router = useRouter();
  const [data, setData] = useState("No result");

  const getHostname = (url) => {
    return new URL(url).hostname;
  };

  const host = config.host;
  const hostDomain = getHostname(host);

  const openDashboard = (event) => {
    router.push("/dashboard");
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <Head>
        <title>Connect to Earn | urFeed</title>
      </Head>
      <h1>CAMERA </h1>

      <div style={{ width: "480px", height: "896px" }}>
        <QrScanner
          onDecode={(result) => {
            alert(result);
            if (result) {
              const domain = getHostname(result);
              setData(result?.text);
              if (domain != hostDomain) {
                alert("Not a urFeed QR code");
              } else {
                const trim = result.replace(host, "");

                router.push("/" + trim);
              }
            }

            if (!!error) {
              console.info(error);
            }
          }}
        />
      </div>
      <p className="break-words width-100">{data}</p>

      <button
        onClick={openDashboard}
        className="px-5 py-3 mb-3 text-xl text-buttontext w-[80%] self-center rounded-xl bg-primary-600 "
      >
        Dashboard
      </button>
    </div>
  );
}

export default Camera;
