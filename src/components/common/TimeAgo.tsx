import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';

function readableUTCDateString(date: Date) {
    return date.getUTCFullYear()
        + '-' + (date.getUTCMonth()+1).toString().padStart(2, '0')
        + '-' + date.getUTCDate().toString().padStart(2, '0')
        + ' ' + date.getUTCHours().toString().padStart(2, '0')
        + ':' + date.getMinutes().toString().padStart(2, '0')
        + ' (UTC)';
}

interface Options {
    timestamp: number;
}

// this should probably better receive a language string instead of post/prefix
export default function TimeAgo({ timestamp }: Options) {
    let date = new Date(timestamp * 1000);
    const [dummyCounter, updateState] = useState(0); // only here to force a rerender
    const isoString = date.toISOString();
    let title = readableUTCDateString(date);

    useEffect(() => {
        function rerender() {
            updateState(dummyCounter+1);
            timer = setTimeout(rerender, 1000);
        }
        let timer = setTimeout(rerender, 1000);
        return () => clearTimeout(timer);
    });

    return <time dateTime={isoString} title={title}>
        {formatDistanceToNow(date)}
    </time>;
}