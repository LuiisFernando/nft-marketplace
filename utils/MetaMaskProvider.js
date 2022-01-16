import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { injected } from '../utils/connector';
import { useWeb3React } from '@web3-react/core'

function MetamaskProvider({ children }) {
    const { active: networkActive, error: networkError, activate: activateNetwork, account } = useWeb3React()
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        async function conectar() {
            await activateNetwork(injected)
        }

        injected
            .isAuthorized()
            .then((isAuthorized) => {
                setLoaded(true)
                if (isAuthorized && !networkActive && !networkError) {
                    conectar()
                } else {
                    conectar() // if is not authorized, ask for authorization and connection
                }
            })
            .catch(() => {
                setLoaded(true)
            })
    }, [activateNetwork, networkActive, networkError])
    if (loaded) {
        return children;
    }
    return <>Loading</>
}

export default MetamaskProvider