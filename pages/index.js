import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import Web3Modal from 'web3modal';
import Web3 from 'web3';

import {
  nftaddress, nftmarketadress
} from '../config.js';

import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const web3 = new Web3('ws://localhost:8545');

  async function loadNFTs() {
    const tokenContract = new web3.eth.Contract(NFT.abi, nftaddress);
    const marketContract = new web3.eth.Contract(Market.abi, nftmarketadress);

    const data = await marketContract.methods.fetchMarketItems().call();
    const items = await Promise.all(data.map(async i => {

      const tokenUri = await tokenContract.methods.tokenURI(i.tokenId).call();

      const meta = await axios.get(tokenUri);
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether');

      let item = {
        price: price,
        tokenId: Number(i.tokenId),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.descrption
      };
      return item;
    }));

    setNfts(items);
    setLoadingState('loaded');
  }

  useEffect(() => {
    loadNFTs();
  }, []);


  async function buyNft(nft) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketadress, Market.abi, signer);

    const price = new ethers.utils.parseUnits(nft.price.toString(), 'ether');

    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, { value: price });

    await transaction.wait();

    loadNFTs();
  }

  if (loadingState === 'loaded' && !nfts.length) return (
    <h1 className='px-20 py-10 text-3xl'>No items in marketplace</h1>
  )

  return (
    <div className='flex justify-center'>
      <div className='px-4' style={{ maxWidth: '1600px' }}>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
          {
            nfts.map((nft, index) => (
              <div key={index} className='border shadow rounded-xl overflow-hidden'>
                <img src={nft.image} alt='nft-image' />
                <div className='p-4'>
                  <p style={{ height: '64px' }} className='text-2xl font-semibold'>{nft.name}</p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className='text-gray-400'>{nft.description}</p>
                  </div>
                </div>
                <div className='p-4 bg-black'>
                  <p className='text-2xl mb-4 font-bold text-white'>{nft.price} ETH</p>
                  <button className='w-full bg-pink-500 text-white font-bold py-2 px-12 rounded'
                    onClick={() => buyNft(nft)}
                  >
                    Buy
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}