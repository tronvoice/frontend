import { useEffect, useState } from 'react';
import useConnection from '../../hooks/useConnection';
import { simplifyArrayWithBigNumbers, simplifyObjectWithBigNumbers } from '../../misc/util';
import LoadingIndicator from '../common/LoadingIndicator';
import Tooltip from '../common/Tooltip';
import NewPost from './NewPost';
import { PostInfo } from './Post';
import styles from './Post.module.scss';
import PostContent from './PostContent';

interface Props {
    id: number;
    full?: boolean; // also load replies, etc.
}

export default function PostLoader({ id, full = false }: Props) {
    const [connection] = useConnection();
    const [postInfo, setPostInfo] = useState<PostInfo|undefined>();
    const [replyIds, setReplyIds] = useState<number[]>([]);

    useEffect(() => {
        if (connection.status !== 'connected') {
            return;
        }
        (async () => {
            const latestPostRaw = await connection.contract.getPost(id).call();
            const latestPost = simplifyObjectWithBigNumbers(latestPostRaw as any) as PostInfo;
            latestPost.owner = connection.tronWeb.address.fromHex(latestPost.owner);
            setPostInfo(latestPost);
        })();
    }, [connection.status, id]);

    useEffect(() => {
        if (connection.status !== 'connected' || !full || !postInfo || postInfo.replyCount === 0) {
            return;
        }
        (async () => {
            const replyIdsRaw = await connection.contract.getReplies(id).call();
            const replyIds = simplifyArrayWithBigNumbers(replyIdsRaw);
            replyIds.reverse();
            setReplyIds(replyIds);
        })();
    }, [connection.status, id, postInfo]);

    if (!postInfo) {
        return <article className={styles.post + ' ' + styles.loading}>
            <LoadingIndicator color='white' width={200} />
        </article>;
    }

    let replyPart: JSX.Element | null = null;
    let answerPart: JSX.Element | null = null;
    let replies: JSX.Element | null = null;
    if (postInfo.replyTo && full) {
        replyPart = <div className={styles.replyTo}>
            <div className={styles.replyDivider}>
                <div className={styles.icon}>
                    <Tooltip content='The below post was an reply to this' element='span'>
                        <svg viewBox="0 0 32 32">
                            <path d="M18 7.762v-7.762l12 12-12 12v-7.932c-13.961-0.328-13.362 9.493-9.808 15.932-8.772-9.482-6.909-24.674 9.808-24.238z"></path>
                        </svg>
                    </Tooltip>
                </div>
                <div className={styles.repliedpost}>
                    <PostLoader id={postInfo.replyTo} />
                </div>
            </div>
        </div>;
    }
    if (full && id !== 0) {
        answerPart = <div className={styles.replyTo}>
            <div className={styles.replyDivider}>
                <div className={styles.icon}>
                    <Tooltip content='Reply to the post above' element='span'>
                        <svg viewBox="0 0 32 32">
                            <path d="M8.192 0c-3.554 6.439-4.153 16.259 9.808 15.932v-7.932l12 12-12 12v-7.762c-16.718 0.436-18.58-14.757-9.808-24.238z"></path>
                        </svg>
                    </Tooltip>
                </div>
                <div className={styles.repliedpost}>
                    <h3>Write a Reply</h3>
                    <NewPost replyPostId={id} />
                </div>
            </div>
        </div>
    }
    if (replyIds.length !== 0) {
        replies = <div>
            <h3>Replies</h3>
            {replyIds.map(id => <PostLoader id={id} key={id} />)}
        </div>
    }

    return <>
        {replyPart}
        <article className={styles.post + ' ' + (!postInfo ? styles.loading : '')}>
            <PostContent id={id} data={postInfo} />
        </article>
        {answerPart}
        {replies}
    </>;
}