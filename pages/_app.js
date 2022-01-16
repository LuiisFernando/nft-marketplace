import '../styles/globals.css'
import React from 'react';
import Web3 from 'web3';
import Menu from '../components/Menu';

import { Web3ReactProvider } from '@web3-react/core';
import Web3ReactManager from '../utils/Web3ReactManager';

function getLibrary(provider) {
  return new Web3(provider)
}

function MyApp({ Component, pageProps }) {

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ReactManager>
        <Menu />
        <Component {...pageProps} />
      </Web3ReactManager>
    </Web3ReactProvider>
  )
}

export default MyApp
