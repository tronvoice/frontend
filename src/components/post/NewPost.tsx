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
    const [newPost, setNewPostText] = useState({ text: '', length: 0 });

    if (!accountInfo || connection.status !== 'connected') {
        return <div>Login!</div>
    }

    async function post() {
        if (connection.status !== 'connected') {
            return;
        }
        await connection.contract.post(newPost.text, replyPostId ?? 0).send({
            callValue: 1_000_000, // 1 TRX
        });
        await new Promise(resolve => setTimeout(resolve, 200));
        (window as any).location.reload();
    }

    function edit(newText: string) {
        const length = new Blob([newText]).size;
        if (length > CHAR_LIMIT) {
            while (new Blob([newText]).size > CHAR_LIMIT) {
                newText = newText.slice(0, -1);
            }
            setNewPostText({ text: newText, length: new Blob([newText]).size } );
        } else {
            setNewPostText({ text: newText, length });
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
        <textarea onChange={(ev) => edit(ev.target.value)} value={newPost.text}></textarea>
        <div className={styles.bottom}>
            {shownOnHomepage && <div className={styles.stats}>{newPost.length}/{CHAR_LIMIT} bytes left</div>}
            <div className={styles.submit}>
                <button onClick={post}>Post</button>
            </div>
        </div>
    </section>;
}