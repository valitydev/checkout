import { Alert, ListItem, UnorderedList, VStack, Text } from '@chakra-ui/react';
import { useContext } from 'react';

import { LocaleContext } from 'checkout/contexts';
import { isNil } from 'checkout/utils';

export type P2PAlertProps = {
    receiptRequired: boolean;
};

export function P2PAlert({ receiptRequired }: P2PAlertProps) {
    const { l } = useContext(LocaleContext);

    const localePath = receiptRequired ? l['form.p2p.alert.li'] : l['form.p2p.alert.li.receipt'];

    return (
        <>
            {!isNil(localePath) && (
                <Alert borderRadius="xl" p={3} status="warning">
                    <VStack align="stretch">
                        <UnorderedList>
                            {localePath.map((value, key) => (
                                <ListItem key={key} fontSize="sm">
                                    {value}
                                </ListItem>
                            ))}
                        </UnorderedList>
                        <Text fontSize="sm">{l['form.p2p.alert.p']}</Text>
                    </VStack>
                </Alert>
            )}
        </>
    );
}
