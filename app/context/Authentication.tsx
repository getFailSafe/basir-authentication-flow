"use client";

import { useEffect, useState } from "react";

import {
  useWeb3ModalAccount,
  useWeb3ModalProvider
} from "@web3modal/ethers/react";
import { ToastContainer, toast } from "react-toastify";
import { BrowserProvider } from "ethers";
import FailSafeAuthentication from "../service/FailSafeAuthentication";
import { useAtom } from "jotai";
import { userAtom } from "../atom";

const axios = require("axios");

const AuthenticationWrapper = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useAtom(userAtom);
  const [loading, setLoading] = useState(false);
  const [loadingMsj, setLoadingMsj] = useState("");
  const [userAddress, setUserAddress] = useState("");

  const AUTHENTICATION_STATE = {
    INITIAL_STATE: "initial_state",
    SIGNING_STATE: "signing_state"
  };

  const [authState, setAuthState] = useState(
    AUTHENTICATION_STATE.INITIAL_STATE
  );
  const { address, chainId, isConnected } = useWeb3ModalAccount();

  const { walletProvider }: any = useWeb3ModalProvider();

  useEffect(() => {
    if (isConnected) {
      setUserAddress(address || "");
      setAuthState(AUTHENTICATION_STATE.SIGNING_STATE);
    } else {
      setAuthState(AUTHENTICATION_STATE.INITIAL_STATE);
    }
  }, [isConnected]);

  async function onSignMessage(message: any) {
    const toastId = toast.loading("Verifying and Adding your wallet");
    try {
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const signature = await signer?.signMessage(message);

      console.log(signature);

      toast.update(toastId, {
        render: "Wallet Signed successfully!",
        type: "success",
        isLoading: false,
        autoClose: 5000
      });

      return signature;
    } catch (err) {
      console.log("onSignMessage Error:", err);
      toast.update(toastId, {
        render: "Failed to Sign a signature",
        type: "error",
        isLoading: false,
        autoClose: 5000
      });

      return null;
    }
  }

  async function initiateAuth() {
    try {
      setLoading(true);

      setLoadingMsj("Preparing the message to sign");

      const user = await FailSafeAuthentication(address, "", "", axios);

      // const user = await Auth.signIn(address);
      console.log("user data:", user);

      if (user.ChallengeName === "CUSTOM_CHALLENGE") {
        // The user is expected to sign the challenge message here
        setLoadingMsj("Check metamask to sign a message");
        const signature = await onSignMessage(user.ChallengeParameters.message);
        setLoadingMsj("Please Wait! We're Verifying the Ownership...");

        if (signature == null) throw new Error("Signed message didn't qualify");

        let challengeAnswer = {
          signature
        };

        try {
          const authenticatedUser = await FailSafeAuthentication(
            address,
            challengeAnswer,
            user.Session,
            axios
          );

          setUser(authenticatedUser.AuthenticationResult);
          console.log("Successfully authenticated", authenticatedUser);
        } catch (err) {
          console.log("Challenge response error", err);
        }
      }

      // Redirect user to another page if already logged in
    } catch (err) {
      console.log("Err", err);
      // User not logged in, show login or registration
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {loading ? (
        <div className="flex flex-row text-black justify-center content-center">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
          <div className="p-1">{loadingMsj}</div>
        </div>
      ) : (
        <>
          {user ? (
            <div>{children}</div>
          ) : (
            <>
              {authState == AUTHENTICATION_STATE.INITIAL_STATE && (
                <div className="flex items-center justify-center h-screen pt-28">
                  <w3m-button />
                </div>
              )}
              {authState == AUTHENTICATION_STATE.SIGNING_STATE && (
                <div>
                  <w3m-button />
                  <button
                    className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    onClick={initiateAuth}
                  >
                    Authenticate
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AuthenticationWrapper;



