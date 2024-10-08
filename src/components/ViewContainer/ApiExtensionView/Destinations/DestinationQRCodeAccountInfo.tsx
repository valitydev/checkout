import { VStack, Text, Divider } from '@chakra-ui/react';
import { decode } from 'js-base64';
import { useContext, useMemo } from 'react';

import { QRCode } from 'checkout/components';
import { LocaleContext } from 'checkout/contexts';

export type DestinationQRCodeAccountInfoProps = {
    qrCode: string;
};

export function DestinationQRCodeAccountInfo({ qrCode }: DestinationQRCodeAccountInfoProps) {
    const { l } = useContext(LocaleContext);
    const decodedQRCode = useMemo(() => decode(qrCode), [qrCode]);

    return (
        <VStack align="stretch">
            <Text textAlign="center">{l['form.p2p.destination.qrCode.description']}</Text>
            <QRCode text={decodedQRCode} />
            <Divider />
        </VStack>
    );
}
