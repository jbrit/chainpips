import "../styles/globals.css";
import "antd/dist/antd.css";
import type { AppProps } from "next/app";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { WagmiConfig } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chains, wagmiClient } from "$utils/rainbow";
import { AppContextProvider } from "$utils/context";
import { useState } from "react";

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function MyApp({ Component, pageProps }: AppProps) {
  const [currentPair, setCurrentPair] = useState("EURUSD");
  return (
    <AppContextProvider
      value={{
        currentPair,
        setCurrentPair,
      }}
    >
      <Web3ReactProvider getLibrary={getLibrary}>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains}>
            <Component {...pageProps} />
          </RainbowKitProvider>
        </WagmiConfig>
      </Web3ReactProvider>
    </AppContextProvider>
  );
}

export default MyApp;
