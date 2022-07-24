import { useEffect, useState } from 'react';
import styles from './Account.module.scss';
import useConnection from '../../hooks/useConnection';
import Link from 'next/link';
import useAccount from '../../hooks/useAccount';
import { Layout } from '../common/Layout';

export default function Account() {
    const [connection, connect] = useConnection();
    const accountInfo = useAccount(connection.status === 'connected' ? connection.address : undefined);

    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [image, setImage] = useState('');

    useEffect(() => {
        if (!accountInfo) {
            return;
        }
        setName(accountInfo.name);
        setUrl(accountInfo.url);
        setImage(accountInfo.image);
    }, [accountInfo]);

    async function setAccount() {
        if (connection.status !== 'connected') {
            return;
        }
        let callValue = 0;
        if (!accountInfo || accountInfo.created === 0) {
            callValue = 1_000_000;
        }
        await connection.contract.setAccount(name, image, url).send({ callValue });
        await new Promise(resolve => setTimeout(resolve, 1000));
        (window as any).location.href = '/';
    }

    return <Layout>
        <section className={styles.section}>
            <h2>Account Data</h2>
            <table className={styles.table}>
                <tbody>
                    <tr>
                        <th>Address</th>
                        <td>{connection.status === 'connected'
                        ? <a href={"https://shasta.tronscan.org/#/address/" + connection.address} target="_blank">{connection.address}</a>
                        : 'N/A'}</td>
                    </tr>
                    <tr>
                        <th>Name</th>
                        <td><input type="text" value={name} onChange={(ev) => setName(ev.target.value)} /></td>
                    </tr>
                    <tr>
                        <th>Image URL</th>
                        <td><input type="text" placeholder='https://...' value={image} onChange={(ev) => setImage(ev.target.value)} /></td>
                    </tr>
                    <tr>
                        <th>Website URL</th>
                        <td><input type="text" placeholder='https://...' value={url} onChange={(ev) => setUrl(ev.target.value)} /></td>
                    </tr>
                    <tr>
                        <td><Link href="/">Back</Link></td>
                        <td><button onClick={setAccount}>Save</button></td>
                    </tr>
                </tbody>
            </table>
        </section>
    </Layout>
}