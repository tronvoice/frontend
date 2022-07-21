import { useRouter } from 'next/router';
import { Layout } from '../common/Layout';
import PostLoader from './PostLoader';

export interface PostInfo {
    owner: string;
    text: string;
    date: number;
    likes: number;

    replyTo: number;
    replyCount: number;
}

export default function Post() {
    const router = useRouter();
    const postId = router.query.postId;
    if (typeof postId !== 'string') {
        return <div></div>
    }

    return <Layout>
        <PostLoader id={parseInt(postId, 10)} full={true} />
    </Layout>;
}