import { VStack, Text, Divider } from '@chakra-ui/react';
import { useContext } from 'react';

import { QRCode } from 'checkout/components';
import { LocaleContext } from 'checkout/contexts';

export type DestinationQRCodeAccountInfoProps = {
    qrCode: string;
};

export function DestinationQRCodeAccountInfo({ qrCode }: DestinationQRCodeAccountInfoProps) {
    const { l } = useContext(LocaleContext);

    return (
        <VStack align="stretch">
            <Text textAlign="center">{l['form.p2p.destination.qrCode.description']}</Text>
            <QRCode text={qrCode} />
            <Divider />
        </VStack>
    );
}
