import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import Web3Modal from 'web3modal';
import { useWeb3React } from "@web3-react/core"

import { nftaddress, nftmarketadress } from '../config';

import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';

export default function MyAssets() {
    const [nfts, setNfts] = useState([]);
    const [loadingState, setLoadingState] = useState('not-loaded');
    const { active, account } = useWeb3React();

    async function loadNfts() {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer);
        const marketContract = new ethers.Contract(nftmarketadress, Market.abi, signer);
        const data = await marketContract.fetchMyNFTs();

        const items = await Promise.all(data.map(async i => {
            const tokenUri = await tokenContract.tokenURI(i.tokenId);
            const meta = await axios.get(tokenUri);
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.data.image,
            };
            return item;
        }));
        setNfts(items);
        setLoadingState('loaded');
    }

    useEffect(() => {
        if (active)
            loadNfts();
    }, [active, account]);

    if (loadingState === 'loaded' && !nfts.length) {
        return (
            <h1 className='py-10 px-20 text-3xl'>No assets owned</h1>
        );
    }

    return (
        <div className='flex justify-center'>
            <div className="p-4">
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
                    {
                        nfts.map((nft, i) => {
                            return (
                                <div key={i} className='border shadow rounded-xl overflow-hidden'>
                                    <img src={nft.image} alt="" className='rounded' />
                                    <div className='p-4 bg-black'>
                                        <p className='text-2xl font-bold text-white'>
                                            Price - {nft.price} Eth
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
}