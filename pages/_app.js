import '../styles/globals.css'
import React from 'react';
import Web3 from 'web3';
import Menu from '../components/Menu';

import { Web3ReactProvider } from '@web3-react/core';
import MetamaskProvider from '../utils/MetaMaskProvider';

function getLibrary(provider) {
  return new Web3(provider)
}

function MyApp({ Component, pageProps }) {

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <MetamaskProvider>
        <Menu />
        <Component {...pageProps} />
      </MetamaskProvider>
    </Web3ReactProvider>
  )
}

export default MyApp
