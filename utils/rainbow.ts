import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  Chain
} from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

const bnbChain = {
  id: 97,
  name: "Binance Smartchain Testnet",
  network: "binance smartchain testnet",
  rpcUrls: {
    default: "https://data-seed-prebsc-1-s3.binance.org:8545",
  },
  blockExplorers: {
    default: {
      name: "bscscan",
      url: "https://testnet.bscscan.com",
    },
  },
  nativeCurrency: {
    name: "tBNB",
    symbol: "tBNB",
    decimals: 18,
  },
  testnet: false,
} as Chain;

export const { chains, provider } = configureChains(
  [bnbChain],
  [
    publicProvider()
  ]
);
const { connectors } = getDefaultWallets({
  appName: 'ChainPips',
  chains
});
export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})