import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useAccount from '../../hooks/useAccount';
import useConnection from '../../hooks/useConnection';
import { simplifyArrayWithBigNumbers } from '../../misc/util';
import PostLoader from '../post/PostLoader';
import styles from './Profile.module.scss';

export default function Profile() {
    const router = useRouter();
    const [connection] = useConnection();
    let address: string | undefined = router.query.address as string;
    if (typeof address !== 'string') {
        address = undefined;
    }

    let [latestPosts, setLatestPosts] = useState<number[]>([]);
    const profile = useAccount(address);

    useEffect(() => {
        if (!profile || connection.status !== 'connected') {
            return;
        }
        (async () => {
            const postIds = await connection.contract.get5PostIds(connection.address, 0).call();
            setLatestPosts(simplifyArrayWithBigNumbers(postIds).filter(e => e !== 0));
        })();
    }, [connection.status, address, profile]);

    if (!address || !profile) {
        return <div></div>
    }

    return <div className="container">
        <div className={styles.author}>
            <div className={styles.img}>
                <img src={profile.image} alt="Profile image" />
            </div>
            <h2>{profile.name}</h2>
            <h3>{address}</h3>
            <div className={styles.info}>
                {profile.url && <div>
                    <svg viewBox="0 0 32 32">
                        <path d="M13.757 19.868c-0.416 0-0.832-0.159-1.149-0.476-2.973-2.973-2.973-7.81 0-10.783l6-6c1.44-1.44 3.355-2.233 5.392-2.233s3.951 0.793 5.392 2.233c2.973 2.973 2.973 7.81 0 10.783l-2.743 2.743c-0.635 0.635-1.663 0.635-2.298 0s-0.635-1.663 0-2.298l2.743-2.743c1.706-1.706 1.706-4.481 0-6.187-0.826-0.826-1.925-1.281-3.094-1.281s-2.267 0.455-3.094 1.281l-6 6c-1.706 1.706-1.706 4.481 0 6.187 0.635 0.635 0.635 1.663 0 2.298-0.317 0.317-0.733 0.476-1.149 0.476z"></path>
                        <path d="M8 31.625c-2.037 0-3.952-0.793-5.392-2.233-2.973-2.973-2.973-7.81 0-10.783l2.743-2.743c0.635-0.635 1.664-0.635 2.298 0s0.635 1.663 0 2.298l-2.743 2.743c-1.706 1.706-1.706 4.481 0 6.187 0.826 0.826 1.925 1.281 3.094 1.281s2.267-0.455 3.094-1.281l6-6c1.706-1.706 1.706-4.481 0-6.187-0.635-0.635-0.635-1.663 0-2.298s1.663-0.635 2.298 0c2.973 2.973 2.973 7.81 0 10.783l-6 6c-1.44 1.44-3.355 2.233-5.392 2.233z"></path>
                    </svg>
                    <a target="blank" href={profile.url}  rel="noopener noreferrer">
                        {profile.url}
                    </a>
                </div>}
                <div>
                    <svg viewBox="0 0 32 32">
                        <path d="M10 12h4v4h-4zM16 12h4v4h-4zM22 12h4v4h-4zM4 24h4v4h-4zM10 24h4v4h-4zM16 24h4v4h-4zM10 18h4v4h-4zM16 18h4v4h-4zM22 18h4v4h-4zM4 18h4v4h-4zM26 0v2h-4v-2h-14v2h-4v-2h-4v32h30v-32h-4zM28 30h-26v-22h26v22z"></path>
                    </svg>
                    Joined {format(new Date(profile.created * 1000), 'do MMMM yyyy')}
                </div>
            </div>
            <div className={styles.info}>
                <div>
                    0 <span className="muted">Following</span>
                </div>
                <div>
                    0 <span className="muted">Followers</span>
                </div>
            </div>
        </div>

        {latestPosts.length !== 0 && <>
            <h2>Latest Posts</h2>
            {latestPosts.map((id) => <PostLoader key={id} id={id} />)}
        </>}
    </div>;
}