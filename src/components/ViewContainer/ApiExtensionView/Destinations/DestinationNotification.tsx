import { Alert, Text } from '@chakra-ui/react';
import { useContext } from 'react';

import { LocaleContext } from 'checkout/contexts';

import { mapNotification } from '../utils';

type NotificationProps = {
    code: string;
};

export function DestinationNotification({ code }: NotificationProps) {
    const { l } = useContext(LocaleContext);
    const message = mapNotification(code, l);

    return (
        <Alert borderRadius="xl" p={3} status="warning">
            <Text fontSize="sm" whiteSpace="pre-wrap">
                {message}
            </Text>
        </Alert>
    );
}
