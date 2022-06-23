import { useEffect, useState } from 'react';
import styles from './Account.module.scss';
import useConnection from '../../hooks/useConnection';
import Link from 'next/link';
import useAccount from '../../hooks/useAccount';

export default function Account() {
    const [connection, connect] = useConnection();
    const accountInfo = useAccount();

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
        console.log('GOING');
        const a = await connection.contract.setAccount(name, image, url).send({
            // feeLimit: 1_000_000,
            // callValue: 0,
            shouldPollResponse: true
        });
        console.log('DONE', a);
    }

    return <div className="container">

        <section className={styles.section}>
            <h2>Account Data</h2>
            <table className={styles.table}>
                <tbody>
                    <tr>
                        <th>Address</th>
                        <td>000</td>
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
    </div>
}