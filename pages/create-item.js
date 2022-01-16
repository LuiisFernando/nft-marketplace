import { useState } from 'react';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import Web3Modal from 'web3modal';

import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import { nftaddress, nftmarketadress } from '../config';

export default function CreateItem() {
    const [fileUrl, setFileUrl] = useState(null);
    const [formInput, updateFormInput] = useState({ price: '', name: '', descrption: '' });
    const router = useRouter();

    async function onChange(e) {
        const file = e.target.files[0];

        try {
            const added = await client.add(
                file,
                {
                    progress: (prog) => console.log(`received: ${prog}`)
                }
            );
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            setFileUrl(url);
        } catch (e) {
            console.log(e);
        }
    }

    async function createItem() {
        const { name, descrption, price } = formInput;

        if (!name || !descrption || !price || !fileUrl) return;

        const data = JSON.stringify({
            name, descrption, image: fileUrl
        });

        try {
            const added = await client.add(data);
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            createSale(url)

        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    async function createSale(url) {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
        let transaction = await contract.createToken(url);
        let tx = await transaction.wait();
        let event = tx.events[0];
        let value = event.args[2];
        let tokenId = value.toNumber();

        const price = ethers.utils.parseUnits(formInput.price, 'ether');

        contract = new ethers.Contract(nftmarketadress, Market.abi, signer);
        let listingPrice = await contract.getListingPrice();
        listingPrice = listingPrice.toString();

        transaction = await contract.createMarketItem(
            nftaddress, tokenId, price, { value: listingPrice }
        );

        await transaction.wait();
        router.push('/')
    }

    return (
        <div className='flex justify-center'>
            <div className='w-1/2 flex flex-col pb-12'>
                <input
                    placeholder='Asset Name'
                    className='mt-8 border rouded pb-4'
                    onChange={(e) => updateFormInput({ ...formInput, name: e.target.value })}
                />
                <textarea
                    placeholder='Asset Description'
                    className='mt-2 border rounded pb-4'
                    onChange={(e) => updateFormInput({ ...formInput, descrption: e.target.value })}
                />
                <input
                    placeholder='Asset Price in Matic'
                    className='mt-2 border rouded pb-4'
                    onChange={(e) => updateFormInput({ ...formInput, price: e.target.value })}
                />
                <input
                    type="file"
                    name="Asset"
                    className='my-4'
                    onChange={onChange}
                />
                {
                    fileUrl && (
                        <img src={fileUrl} alt="" className='rounded mt-4' width={350} />
                    )
                }
                <button onClick={createItem} className='font-bold mt-4 bg-pink-500 text-white rounded pb-4 pt-4 shadow-lg'>
                    Create Digital Asset
                </button>
            </div>
        </div>
    )
}