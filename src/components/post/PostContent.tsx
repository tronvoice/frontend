import styles from './Post.module.scss';
import TimeAgo from '../common/TimeAgo';
import Tooltip from '../common/Tooltip';
import ReactLinkify from 'react-linkify';
import Link from 'next/link';
import useAccount from '../../hooks/useAccount';
import useConnection from '../../hooks/useConnection';
import likedPosts from '../../misc/likedPosts';

export interface PostInfo {
    owner: string;
    text: string;
    date: number;
    likes: number;

    replyTo: number;
    replyCount: number;
}

export default function PostContent({ id, data }: { id: number; data: PostInfo }) {
    const [connection] = useConnection();
    const accountInfo = useAccount(data.owner);
    if (!accountInfo) {
        return <div></div>;
    }
    const isLiked = likedPosts.isLiked(id);

    async function like() {
        if (connection.status !== 'connected') {
            return;
        }
        await connection.contract.like(id).send({
            // feeLimit: 1_000_000,
            callValue: 10_000_000,
        });
        likedPosts.markAsLiked(id);
    }

    return <>
        <div className={styles.posttop}>
            <div className={styles.img}>
                <Link href={`/profile/${data.owner}`}><a><img src={accountInfo.image} /></a></Link>
            </div>
            <div className={styles.author}>
                <Link href={`/profile/${data.owner}`}>{accountInfo.name}</Link>
                <div className={styles.address}><Link href={`/profile/${data.owner}`}>{data.owner}</Link></div>
            </div>
            <div className={styles.date}>
                <Link href={`/post/${id}`}><a><TimeAgo timestamp={data.date} /></a></Link>
            </div>
        </div>
        <div className={styles.content}>
            <ReactLinkify
                componentDecorator={(decoratedHref, decoratedText, key) => (
                    <a target="blank" href={decoratedHref} key={key} rel="noopener noreferrer">
                        {decoratedText}
                    </a>
                )}
            >{data.text}</ReactLinkify>
        </div>
        <div className={styles.postbottom}>
            <div className={styles.like + ' ' + (isLiked ? styles.liked : '')} onClick={like}>
                <svg viewBox="-1 -1 34 34">
                    <path d="M23.6 2c-3.363 0-6.258 2.736-7.599 5.594-1.342-2.858-4.237-5.594-7.601-5.594-4.637 0-8.4 3.764-8.4 8.401 0 9.433 9.516 11.906 16.001 21.232 6.13-9.268 15.999-12.1 15.999-21.232 0-4.637-3.763-8.401-8.4-8.401z"></path>
                </svg>{data.likes}
            </div>
            <div className={styles.comments}>
                <Link href={`/post/${id}`}><a>
                    <svg viewBox="0 0 32 32">
                        <path d="M16 2c8.837 0 16 5.82 16 13s-7.163 13-16 13c-0.849 0-1.682-0.054-2.495-0.158-3.437 3.437-7.539 4.053-11.505 4.144v-0.841c2.142-1.049 4-2.961 4-5.145 0-0.305-0.024-0.604-0.068-0.897-3.619-2.383-5.932-6.024-5.932-10.103 0-7.18 7.163-13 16-13z"></path>
                    </svg>{data.replyCount}
                </a></Link>
            </div>
            {data.replyTo !== 0 && <div className={styles.reply}>
                <Tooltip content="This is a reply to another post!" element='span'>
                    <Link href={`/post/${id}`}><a><svg viewBox="0 0 32 32">
                        <path d="M8.192 0c-3.554 6.439-4.153 16.259 9.808 15.932v-7.932l12 12-12 12v-7.762c-16.718 0.436-18.58-14.757-9.808-24.238z"></path>
                    </svg></a></Link>
                </Tooltip>
            </div>}
        </div>
    </>;
}