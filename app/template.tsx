"use client";

import AuthenticationWrapper from "@/app/context/Authentication";

import { Web3ModalProvider } from "@/app/context/Web3Modal";


export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <Web3ModalProvider>
      <div className="bg-white">
        <AuthenticationWrapper>{children}</AuthenticationWrapper>
      </div>
    </Web3ModalProvider>
  );
}
