import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { setCookie } from "cookies-next";

const logo = "/Logomark.png";

function Login() {
  const router = useRouter();
  const refererUserId = router.query.refererUserId;
  const refererUserName = router.query.refererUserName;
  const [formData, updateFormData] = useState({
    mobileNumber: "",
    userName: "",
    otp: "",
  });
  const [stage, updateStage] = useState("signup");

  useEffect(() => {
    const getUserAndWallet = async () => {
      const user = await fetch(`/api/auth/wallet`).then((res) => res.json());
       
      if (user?.userName) {
        if (refererUserId) {
          router.push(
            `/addwallet?refererUserId=${refererUserId}&refererUserName=${refererUserName}`
          );
        } else {
          router.push(`/addwallet`);
        }
      }
    };
    getUserAndWallet();
  }, [refererUserId, refererUserName, router]);

  const handleChange = (e) => {
    updateFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
     
  };

  const createUser = async () => {
    try {
       
      const user = await fetch(
        `/api/auth/register?userName=${formData.userName}&mobileNumber=${encodeURIComponent(formData.mobileNumber)}`
      );

      if (!user) {
        alert("Signup Error");
      } else {
        updateStage("otp");
      }
    } catch (error) {
      alert("Error: " + error.code + " " + error.message);
    }
  };

  const verifyOTP = async () => {
    try {
      const auth = await fetch(
        `/api/auth/verifyotp?otp=${formData.otp}&mobileNumber=${formData.mobileNumber}`
      ).then((res) => res.json());
       
      if (!auth.result) {
        alert("OTP error");
      } else {
        setCookie("authToken", auth.result.authToken);
        setCookie("refreshToken", auth.result.refreshToken);
        refererUserId
          ? router.push(
              `/addwallet?refererUserId=${refererUserId}&refererUserName=${refererUserName}`
            )
          : router.push(`/addwallet`);
      }
    } catch (error) {
      alert("Error: " + error.code + " " + error.message);
    }
  };

  const loginUser = async () => {
    try {
      const user = await fetch(
        `/api/auth/login?mobileNumber=${formData.mobileNumber}`
      ).then((res) => res.json());
       
      if (!user?.mobileNumber) {
        alert("Error with mobile number");
      } else {
        updateStage("otp");
      }
    } catch (error) {
      alert("Error: " + error.code + " " + error.message);
    }
  };

  const changeUX = (e) => {
    if (stage === "signup") {
      updateStage("login");
    } else {
      updateStage("signup");
    }
  };

  const renderStage = () => {
    switch (stage) {
      case "signup":
        return (
          <div className="max-w-md w-7/12 min-w-full ">
            <div className="mb-10">
              <h3 className="font-heading text-4xl mb-10 text-center">
                Sign Up
              </h3>
            </div>
            <div className="mb-4"></div>
            <input
              onChange={handleChange}
              className="block mb-2 w-full px-5 py-3 colourDark focus:border-green-700 outline-none border border-primary-200 rounded-lg"
              type="text"
              placeholder="Enter Username"
              id="userName"
              name="userName"
            />
            <input
              onChange={handleChange}
              className="block w-full px-5 py-3 outline-none colourDark  focus:border-green-700 border border-primary-200 rounded-lg"
              type="text"
              id="mobileNumber"
              name="mobileNumber"
              placeholder="Your Mobile Number +44"
            />
            <>
              <div className="mb-4"></div>
              <button
                className="px-5 py-3 mb-3 text-xl rounded-xl  min-w-full bg-primary-600  text-buttontext"
                onClick={createUser}
              >
                Sign Up
              </button>{" "}
              <p onClick={changeUX} className="mt-5">
                Already have an account, sign in?
              </p>
            </>
          </div>
        );
      case "login":
        return (
          <div className="max-w-md min-w-full">
            <div className=" mb-4">
              <h3 className="font-heading text-4xl mb-10 text-center">
                Sign in
              </h3>
        
            </div>
            <div className="mb-4"></div>
            {/* <input
              onChange={handleChange}
              className="block mb-2 w-full px-5 py-3 colourDark focus:border-green-700 outline-none border border-primary-200 rounded-lg"
              type="email"
              placeholder="Enter Email"
              id="username"
              name="username"
            /> */}
            <input
              onChange={handleChange}
              className="block w-full px-5 py-3 outline-none colourDark  focus:border-green-700 border border-primary-200 rounded-lg"
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              placeholder="Your Mobile Number e.g +447786386486"
              value={formData.mobileNumber}
            />
            <div className="mb-4"></div>
            <>
              <button
                className="px-5 py-3 mb-3 text-xl min-w-full rounded-xl  border border-white border-opacity-10"
                onClick={loginUser}
              >
                Login
              </button>{" "}
              <p onClick={changeUX} className="mt-5">
                Don&apos;t have an account, need to <span className="text-violet-400 underline underline-offset-1 tex font-bold">sign up?</span>
              </p>
            </>
          </div>
        );
      case "otp":
        return (
          <div className="max-w-md min-w-full">
            <div className=" mb-4">
              <h3 className="font-heading text-4xl mb-10 text-center">
                Verify Otp
              </h3>
              <p className=" mb-10 px-6 text-center">Enter your otp code</p>
            </div>
            <div className="mb-4"></div>
            <input
              onChange={handleChange}
              className="block mb-2 w-full px-5 py-3 colourDark focus:border-green-700 outline-none border border-primary-200 rounded-lg"
              type="text"
              placeholder="Enter otp"
              id="otp"
              name="otp"
              value={formData.otp}
            />
            <div className="mb-4"></div>
            <>
              <button
                className="px-5 py-3 mb-3 text-xl min-w-full rounded-xl  border border-white border-opacity-10"
                onClick={verifyOTP}
              >
                Verify OTP
              </button>{" "}
              {/* <p onClick={changeUX} className="mt-5">
                Dont have an account, need to sign up?
              </p> */}
            </>
          </div>
        );
    }
  };

  return (
    <div>
      <section className="">
        <div className="w-screem h-screen  ">
          <div className=" items-stretch justify-items-stretch w-full  lg:flex h-full flex-row  rounded-2xl ">
            <div className="w-full  lg:h-full  lg:w-6/12  colourDark 3xl:w-1/3 pb-4">
              <div className="pl-6 pt-6 lg:pl-10">
                <a rel="noreferrer" href="https://urfeed.xyz/" target="_blank">
                  <Image alt="logo" src={logo} width={32} height={32} />
                </a>
              </div>
              <div className="px-6 pt-3 self-center lg:px-10">
                <div>
                  <h3 className="font-heading text-3xl ">
                    Earn to mint POC
                  </h3>
                  <br/>
                  <p className="font-light mb-6 ">
                    We have 10,000 <a
                      className="underline underline-offset-2"
                      rel="noreferrer"
                      href="https://urp3ople.xyz/"
                      target="_blank"
                    >
                      p3ople
                    </a> NFTs to give away. All you have to do to win one is create a urID profile and follow the steps below.
                    <br/>
                    <br/>
                    urID is not only gives you the chace to win an p3ople NFT it is also your id for urFeed access. We have other big plans for this digital identity.
                    
                  </p>
                  <div className="w-full  xl:mb-0  relative">
                    <div className="container lg:mx-auto">
                      <div className="max-w-xl lg:mx-auto">
                        <div className="flex mb-8">
                          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full   ">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full ">
                              <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-primary-200 text-white">
                                1
                              </div>
                            </div>
                          </div>
                          <div className=" ml-6">
                            <h6 className="text-2xl mb-2">Create account</h6>
                            <p className="font-light">
                              This is a simple OTP to your phone.
                            </p>
                          </div>
                        </div>
                        <div className="flex mb-8">
                          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full  ">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full ">
                              <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-primary-200 text-white">
                                2
                              </div>
                            </div>
                          </div>
                          <div className=" ml-6">
                            <h6 className="text-2xl mb-2">Add your wallet & mint urID NFT</h6>
                            <p className="font-light">
                              Connect your wallet and we will send to your a QR code NFT linked to urId. 
                              (Not got a wallet? Create a semi custodial wallet for on-ramping comming soon)
                            </p>
                          </div>
                        </div>
                        <div className="flex mb-8">
                          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full ">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full ">
                              <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-primary-200 text-white">
                                3
                              </div>
                            </div>
                          </div>
                          <div className=" ml-6">
                            <h6 className="text-2xl mb-4">
                              Earn points to mint the p3ople NFT
                            </h6>
                            <p className="font-light">
                              Get p3ople to follow you by visting your profile. Earn enough points to mint the p3ople NFT.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div></div>
                </div>
              </div>
            </div>
            <div className="w-full lg:h-full lg:flex lg:w-6/12   align-middle justify-center colourLight">
              <div className=" pt-8  self-center w  pb-24 sm:pb-44  w-6/12  shadow">
                {renderStage()}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
