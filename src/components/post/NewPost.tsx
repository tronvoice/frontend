import Link from 'next/link';
import { useState } from 'react';
import useAccount from '../../hooks/useAccount';
import useConnection from '../../hooks/useConnection';
import styles from './Post.module.scss';

interface Props {
    replyPostId?: number;
}

export default function NewPost({ replyPostId }: Props) {
    const [connection] = useConnection();
    const accountInfo = useAccount(connection.status === 'connected' ? connection.address : undefined);
    const [newPostText, setNewPostText] = useState('');

    if (!accountInfo || connection.status === 'disconnected') {
        return <div>Login!</div>
    }

    async function post() {
        if (connection.status !== 'connected') {
            return;
        }
        await connection.contract.post(newPostText, replyPostId ?? 0).send({});
    }

    return <section className={styles.newPost}>
        <div className={styles.posttop}>
            <div className={styles.img}>
                <Link href={`/profile/${connection.address}`}><a><img src={accountInfo.image} /></a></Link>
            </div>
            <div className={styles.author}>
                <Link href={`/profile/${connection.address}`}>{accountInfo.name}</Link> {!replyPostId && <small className="muted"><Link href="/account">(Edit Account)</Link></small>}
                <div className={styles.address}><Link href={`/profile/${connection.address}`}>{connection.address}</Link></div>
            </div>
        </div>
        <textarea onChange={(ev) => setNewPostText(ev.target.value)} value={newPostText}></textarea>
        <div className={styles.bottom}>
            {!replyPostId && <div className={styles.stats}>{accountInfo.postsCount} posts, {accountInfo.totalLikes} likes, {accountInfo.followersCount} follower, {accountInfo.followingCount} following</div>}
            <div className={styles.submit}>
                <button onClick={post}>Post</button>
            </div>
        </div>
    </section>;
}