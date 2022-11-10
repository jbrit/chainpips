import { useAccount, useProvider, useSigner } from "wagmi";

export const useWalletInfo = () => {
  const signer = useSigner();
  const genericProvider = useProvider();
  const provider = signer.data ?? genericProvider;
  const { address, isConnected } = useAccount();

  return { provider, address, isConnected };
};
