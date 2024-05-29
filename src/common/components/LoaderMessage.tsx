import { Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import { Locale } from 'checkout/contexts';
import { isNil } from 'checkout/utils';

const MESSAGE_CHANGING_INTERVAL = 5000;

export type LoaderMessageProps = {
    l: Locale;
};

export function LoaderMessage({ l }: LoaderMessageProps) {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const messages = l['loaderMessages'];
        if (isNil(messages)) return;

        const interval = setInterval(() => {
            setMessage(messages[Math.floor(Math.random() * messages.length)]);
        }, MESSAGE_CHANGING_INTERVAL);

        return () => clearInterval(interval);
    }, [l]);

    return (
        <Text color="white" fontSize="lg" fontWeight="medium" textAlign="center">
            {message}
        </Text>
    );
}
