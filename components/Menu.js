import React from 'react';
import Link from 'next/link';
import { useWeb3React } from '@web3-react/core'

export default function Menu() {
    const { active: networkActive, error: networkError, activate: activateNetwork, account } = useWeb3React()

    return (
        <nav className='border-b p-6'>
            <p className='text-4xl font-bold'>Metaverse Marketplace</p>
            <div className="flex justify-between">
                <div className='mt-4'>
                    <Link href="/">
                        <a className='mr-4 text-pink-500'>
                            Home
                        </a>
                    </Link>
                    <Link href="/create-item">
                        <a className='mr-6 text-pink-500'>
                            Sell Digital Asset
                        </a>
                    </Link>
                    <Link href="/my-assets">
                        <a className='mr-6 text-pink-500'>
                            My Digital Asset
                        </a>
                    </Link>
                    <Link href="/creator-dashboard">
                        <a className='mr-6 text-pink-500'>
                            Creator Dashboard
                        </a>
                    </Link>
                </div>
                <div className='mt-4'>
                    <span>Carteira {networkActive ? <span>{account}</span> : <span>not-connected</span>}</span>
                </div>
            </div>
        </nav>
    )
}