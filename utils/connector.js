import { InjectedConnector } from '@web3-react/injected-connector'
export const injected = new InjectedConnector({
    supportedChainIds: [1, 1337],
});

// 1337 localhost (hardhat)
// 97 bsc testnet