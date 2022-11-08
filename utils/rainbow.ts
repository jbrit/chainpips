import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
} from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

export const { chains, provider } = configureChains(
  [chain.polygonMumbai],
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