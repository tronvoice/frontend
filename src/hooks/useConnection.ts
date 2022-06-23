import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { createGlobalState } from "react-hooks-global-state";
import abi from '../misc/contractAbi';

interface ConnectStateDisconnected {
    status: 'disconnected';
}
interface ConnectStateConnected { // waiting for user to confirm
    status: 'connected';
    tronWeb: any;
    contract: any; // TODO
    address: string;
    balance: number;
    // balanceBigNumber: ethers.BigNumber;
}

export type ConnectState = ConnectStateDisconnected | ConnectStateConnected;

const { useGlobalState, setGlobalState, getGlobalState } = createGlobalState<{ state: ConnectState }>({
    state: {
        status: 'disconnected',
    }
});

const CONTRACT_ADDRESS = 'TTvzL87zAC9gz3DuBUDzi763DBzMDJhfFt';

export default function useConnection() {
    const [connection, setConnection] = useGlobalState('state');

    useEffect(() => {
        (async () => {
            const tronWeb = (window as any).tronWeb;
            const contract = await tronWeb.contract(abi, CONTRACT_ADDRESS); 
            await tronWeb.request({ method: 'tron_requestAccounts' });
            const balance = parseFloat(tronWeb.fromSun(await tronWeb.trx.getBalance(tronWeb.defaultAddress.base58)));
            setConnection({
                status: 'connected',
                contract,
                tronWeb,
                address: tronWeb.defaultAddress.base58,
                balance,
            });
        })();
    }, []);

    async function connect() {
        // TODO is this needed?
    }

    return [connection, connect] as [ConnectState, () => void];
}