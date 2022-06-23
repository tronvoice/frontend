
import styles from './LoadingIndicator.module.scss';

interface Props {
    height?: number;
    width?: number;
    color?: string;
}

export default function LoadingIndicator({ height, width, color }: Props) {
    const style: any = {};
    if (height) {
        style.height = height + 'px';
    }
    if (width) {
        style.width = width + 'px';
    }
    const styleDivs: any = {};
    if (color) {
        styleDivs.backgroundColor = color;
    }
    return <div className={styles.loading} style={style}><div style={styleDivs}></div><div style={styleDivs}></div><div style={styleDivs}></div></div>;
}
