
import styles from './Layout.module.scss';

interface Props {
    children: React.ReactNode;
}

export function Layout({ children }: Props) {
    return <div className="container">
        <div className={styles.logo}>
            <a href="/"><img src='/logo.png' /></a>
        </div>
        {children}
    </div>;
}