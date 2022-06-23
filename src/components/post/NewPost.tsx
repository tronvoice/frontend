import Link from 'next/link';
import { useState } from 'react';
import useAccount from '../../hooks/useAccount';
import useConnection from '../../hooks/useConnection';
import styles from './Post.module.scss';

interface Props {
    replyPostId?: number;
}

const CHAR_LIMIT = 280;

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

    function edit(newText: string) {
        if (newText.length > CHAR_LIMIT) {
            setNewPostText(newText.slice(0, CHAR_LIMIT));
        } else {
            setNewPostText(newText);
        }
    }

    const shownOnHomepage = !replyPostId;
    
    return <section className={styles.newPost}>
        <div className={styles.posttop}>
            <div className={styles.img}>
                <Link href={`/profile/${connection.address}`}><a><img src={accountInfo.image} /></a></Link>
            </div>
            <div className={styles.author}>
                <Link href={`/profile/${connection.address}`}>{accountInfo.name}</Link> {shownOnHomepage && <small className="muted"><Link href="/account">(Edit Account)</Link></small>}
                <div className={styles.address}><Link href={`/profile/${connection.address}`}>{connection.address}</Link></div>
            </div>
        </div>
        <textarea onChange={(ev) => edit(ev.target.value)} value={newPostText}></textarea>
        <div className={styles.bottom}>
            {shownOnHomepage && <div className={styles.stats}>{CHAR_LIMIT - newPostText.length}/{CHAR_LIMIT} characters left</div>}
            <div className={styles.submit}>
                <button onClick={post}>Post</button>
            </div>
        </div>
    </section>;
}