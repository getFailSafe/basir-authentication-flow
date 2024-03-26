"use client";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import { bsc, mainnet, polygon } from "wagmi/chains";

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WEB3_MODAL_PROJECT_ID || "";
const website = process.env.NEXT_PUBLIC_WEB3_MODAL_WEBSITE || "https://docs.walletconnect.com/";

// Set chains
const mainnetWeb3Modal = {
  chainId: mainnet.id,
  name: mainnet.name,
  currency: mainnet.nativeCurrency.symbol,
  explorerUrl: mainnet.blockExplorers.default.url,
  rpcUrl: mainnet.rpcUrls.default.http[0],
};

const bscWeb3Modal = {
chainId: bsc.id,
name: bsc.name,
currency: bsc.nativeCurrency.symbol,
explorerUrl: bsc.blockExplorers.default.url,
rpcUrl: bsc.rpcUrls.default.http[0],
};

const polygonWeb3Modal = {
chainId: polygon.id,
name: polygon.name,
currency: polygon.nativeCurrency.symbol,
explorerUrl: polygon.blockExplorers.default.url,
rpcUrl: polygon.rpcUrls.default.http[0],
};

// 3. Create modal
const metadata = {
  name: "I-FailSafe",
  description: "Created by I, With love of I",
  url: website,
  icons: [
    "https://docs.walletconnect.com/img/walletconnect-logo-black.svg"
  ]
};

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [mainnetWeb3Modal, bscWeb3Modal, polygonWeb3Modal],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  //...
  themeMode: "light",
});

export function Web3ModalProvider({ children }:any) {
  return children;
}