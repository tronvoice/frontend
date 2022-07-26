import { useEffect, useState } from 'react';
import useConnection, { pLimiter } from './useConnection';
import { createGlobalState } from "react-hooks-global-state";

interface AccountInfo {
    name: string ;
    created: number;
    image: string ;
    url: string ;
    totalLikes: number;
    postsCount: number;
}

interface AccountsCache {
    [address: string]: AccountInfo | 'requesting';
}

const { useGlobalState, setGlobalState, getGlobalState } = createGlobalState<{ cache: AccountsCache }>({
    cache: {}
});

export default function useAccount(address?: string) {
    const [connection] = useConnection();
    const [cache, setCache] = useGlobalState('cache');

    useEffect(() => {
        if (connection.status !== 'connected' || !address || cache[address]) {
            return;
        }
        setCache({
            ...getGlobalState('cache'), // get latest state
            [address]: 'requesting',
        });
        (async () => {
            const accountInfoRaw = await pLimiter(async () => {
                await new Promise(resolve => setTimeout(resolve, 200));
                return await connection.contract.getAccountInfo(address).call();
            });
            const accountInfo: AccountInfo = {
                name: accountInfoRaw.name,
                image: accountInfoRaw.image,
                url: accountInfoRaw.url,
                created: accountInfoRaw.created.toNumber(),
                totalLikes: accountInfoRaw.totalLikes.toNumber(),
                postsCount: accountInfoRaw.postsCount.toNumber(),
            }
            setCache({
                ...getGlobalState('cache'), // get latest state
                [address]: accountInfo,
            });
        })();
    }, [connection.status, address]);

    const accountInfo = cache[address || ''];
    if (accountInfo === 'requesting' || !accountInfo) {
        return undefined;
    }
    return accountInfo;
}