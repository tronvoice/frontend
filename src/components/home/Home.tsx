import { useState } from 'react';
import styles from './Home.module.scss';
import useConnection from '../../hooks/useConnection';
import useAccount from '../../hooks/useAccount';
import Link from 'next/link';
import PostLoader from '../post/PostLoader';
import NewPost from '../post/NewPost';


export default function Home() {
    const [connection, connect] = useConnection();
    const accountInfo = useAccount(connection.status === 'connected' ? connection.address : undefined);

    if (connection.status === 'disconnected') {
        return <div>not connected</div>;
    }

    let accountElement: JSX.Element;

    if (!accountInfo) {
        accountElement = <></>;
    } else if (accountInfo.created === 0) {
        accountElement = <section className={styles.createAccount}>
            <button>Create Account</button>
        </section>;
    } else {
        accountElement = <>
            <NewPost />

            {accountInfo.postsCount !== 0 && <section className={styles.posts}>
                <h2>Your Latest Post</h2>
                <PostLoader id={accountInfo.postsCount - 1} />
            </section>}
        </>;
    }

    return <div className="container">
        {accountElement}

        <h2>Recent Posts</h2>
        <section className={styles.posts}>
            <article>
                <div className={styles.posttop}>
                    <div className={styles.img}></div>
                    <div className={styles.author}>
                        Thomas
                        <div className={styles.address}>TX2kDevwMKSLKj1rFMWoZq44vJ8hbjaNzd</div>
                    </div>
                    <div className={styles.date}>5h ago</div>
                </div>
                <div className={styles.content}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr,</div>
                <div className={styles.postbottom}>
                    <div className={styles.likes}>
                        <svg viewBox="0 0 32 32">
                            <path d="M23.6 2c-3.363 0-6.258 2.736-7.599 5.594-1.342-2.858-4.237-5.594-7.601-5.594-4.637 0-8.4 3.764-8.4 8.401 0 9.433 9.516 11.906 16.001 21.232 6.13-9.268 15.999-12.1 15.999-21.232 0-4.637-3.763-8.401-8.4-8.401z"></path>
                        </svg> 12
                    </div>
                    <div className={styles.comments}>
                        <svg viewBox="0 0 32 32">
                            <path d="M16 2c8.837 0 16 5.82 16 13s-7.163 13-16 13c-0.849 0-1.682-0.054-2.495-0.158-3.437 3.437-7.539 4.053-11.505 4.144v-0.841c2.142-1.049 4-2.961 4-5.145 0-0.305-0.024-0.604-0.068-0.897-3.619-2.383-5.932-6.024-5.932-10.103 0-7.18 7.163-13 16-13z"></path>
                        </svg> 0
                    </div>
                </div>
            </article>
            
            <article>
                <div className={styles.posttop}>
                    <div className={styles.img}></div>
                    <div className={styles.author}>
                        Thomas
                        <div className={styles.address}>TX2kDevwMKSLKj1rFMWoZq44vJ8hbjaNzd</div>
                    </div>
                    <div className={styles.date}>5h ago</div>
                </div>
                <div className={styles.content}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr,</div>
            </article>
            
            <article>
                <div className={styles.posttop}>
                    <div className={styles.img}></div>
                    <div className={styles.author}>
                        Thomas
                        <div className={styles.address}>TX2kDevwMKSLKj1rFMWoZq44vJ8hbjaNzd</div>
                    </div>
                    <div className={styles.date}>5h ago</div>
                </div>
                <div className={styles.content}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr,</div>
            </article>
        </section>
    </div>
}