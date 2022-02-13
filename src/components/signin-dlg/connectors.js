import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";

const RPC_URL_1 =
  "https://mainnet.infura.io/v3/e2d4593179fa4120a217d136a0518efc";
const RPC_URL_4 =
  "https://ropsten.infura.io/v3/e2d4593179fa4120a217d136a0518efc";
const RPC_URL_20 =
  "https://api.elastos.io/eth";
const RPC_URL_21 =
  "https://api-testnet.elastos.io/eth";


const RPC_URLS = {
  1: RPC_URL_1,
  4: RPC_URL_4,
  20: RPC_URL_20,
  21: RPC_URL_21,
};

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 20, 21, 42, 56, 97],
});

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  qrcode: true,
  // supportedChainIds: [1, 3, 4, 5, 20, 21, 42, 10, 137, 69, 420, 80001],
});

export const walletlink = new WalletLinkConnector({
  url: RPC_URLS[1],
  appName: "Global Income Coin",
  supportedChainIds: [1, 3, 4, 5, 20, 21, 42, 10, 137, 69, 420, 80001],
});
