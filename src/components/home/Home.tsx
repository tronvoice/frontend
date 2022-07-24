import { useEffect, useState } from 'react';
import styles from './Home.module.scss';
import useConnection, { pLimiter } from '../../hooks/useConnection';
import useAccount from '../../hooks/useAccount';
import Link from 'next/link';
import PostLoader from '../post/PostLoader';
import NewPost from '../post/NewPost';
import { Layout } from '../common/Layout';
import LoadingIndicator from '../common/LoadingIndicator';
import { simplifyArrayWithBigNumbers } from '../../misc/util';


export default function Home() {
    const [connection, connect] = useConnection();
    const accountInfo = useAccount(connection.status === 'connected' ? connection.address : undefined);
    const [globalPostCount, setGlobalPostCount] = useState<undefined|number>();

    useEffect(() => {
        if (connection.status !== 'connected') {
            return;
        }
        (async () => {
            const globalPostCountBigNum = await pLimiter(async () => {
                await new Promise(resolve => setTimeout(resolve, 200)); // wait a little bit
                return await connection.contract.postsCount().call();
            });
            setGlobalPostCount(globalPostCountBigNum.toNumber());
        })();
    }, [connection.status]);

    let [latestPosts, setLatestPosts] = useState<number[]>([]);
    useEffect(() => {
        if (connection.status !== 'connected' || !connection.address) {
            return;
        }
        (async () => {
            const postIds = await pLimiter(async () => {
                await new Promise(resolve => setTimeout(resolve, 200));
                return await connection.contract.get5PostIds(connection.address, 0).call();
            });
            setLatestPosts(simplifyArrayWithBigNumbers(postIds).reverse().filter(e => e !== 0).slice(0, 3));
        })();
    }, [connection.status]);

    if (connection.status === 'notronlink') {
        return <Layout>
            <div className={styles.connecting}>
                <p>You need to install the TronLink browser extension to connect to this website.</p>
                <p>
                    <a href="https://www.tronlink.org/"><img src="https://www.tronlink.org/home/images/logo.png" /></a>
                </p>
            </div>
        </Layout>;
    }
    if (connection.status === 'disconnected') {
        return <Layout>
            <div className={styles.connecting}>
                <p>Connecting...</p>
                <LoadingIndicator width={100} color='white' />
            </div>
        </Layout>;
    }

    let accountElement: JSX.Element;

    if (!accountInfo) {
        accountElement = <></>;
    } else if (accountInfo.created === 0) {
        accountElement = <section className={styles.createAccount}>
            <Link href="/account">Create Account</Link>
        </section>;
    } else {
        accountElement = <>
            <NewPost />

            {accountInfo.postsCount !== 0 && <section className={styles.posts}>
                <h2>Your Latest Posts</h2>
                {latestPosts.map((id) => <PostLoader key={id} id={id} />)}
            </section>}
        </>;
    }

    let recentPosts: JSX.Element|null = null;
    if (globalPostCount) {
        const posts: JSX.Element[] = [];
        const minPostId = Math.max(1, globalPostCount - 5);
        for (let i = globalPostCount - 1; i >= minPostId; i -= 1) {
            posts.push(<PostLoader key={i} id={i} />);
        }
        recentPosts = <>
            <h2>Recent Posts on TronVoice.com</h2>
            <section className={styles.posts}>
                {posts}
            </section>
        </>;
    }

    return <Layout>
        {accountElement}
        {recentPosts}
    </Layout>
}