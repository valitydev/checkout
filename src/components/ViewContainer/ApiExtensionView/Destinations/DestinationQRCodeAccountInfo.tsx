import { VStack, Text, Divider, Button, useClipboard, useToast } from '@chakra-ui/react';
import isMobile from 'ismobilejs';
import { decode } from 'js-base64';
import { useContext, useEffect, useMemo } from 'react';
import { FaSquareArrowUpRight } from 'react-icons/fa6';
import { HiOutlineDuplicate } from 'react-icons/hi';

import { QRCode } from 'checkout/components';
import { LocaleContext } from 'checkout/contexts';

const QR_CODE_SIZE = 192;

export type DestinationQRCodeAccountInfoProps = {
    qrCode: string;
};

export function DestinationQRCodeAccountInfo({ qrCode }: DestinationQRCodeAccountInfoProps) {
    const { l } = useContext(LocaleContext);
    const isRedirect = useMemo(() => isMobile(window.navigator).phone || isMobile(window.navigator).tablet, []);
    const decodedUrl = useMemo(() => decode(qrCode), [qrCode]);
    const { onCopy, hasCopied } = useClipboard(decodedUrl);
    const toast = useToast();

    useEffect(() => {
        if (!hasCopied) return;
        toast({
            title: l['form.p2p.copied'],
            status: 'success',
            variant: 'subtle',
            duration: 3000,
        });
    }, [hasCopied, l]);

    const redirect = () => {
        window.open(decodedUrl, '_blank');
    };

    return (
        <VStack align="stretch">
            <Text fontSize="sm" textAlign="center">
                {l['form.p2p.destination.qrCode.description']}
            </Text>
            <QRCode size={QR_CODE_SIZE} text={decodedUrl} />
            {isRedirect ? (
                <Button
                    borderRadius="xl"
                    colorScheme="brand"
                    rightIcon={<FaSquareArrowUpRight />}
                    variant="outline"
                    onClick={redirect}
                >
                    {l['form.p2p.destination.qrCode.button.redirect']}
                </Button>
            ) : (
                <Button
                    borderRadius="xl"
                    colorScheme="brand"
                    rightIcon={<HiOutlineDuplicate />}
                    variant="outline"
                    onClick={onCopy}
                >
                    {l['form.p2p.destination.qrCode.button.copy']}
                </Button>
            )}
            <Divider />
        </VStack>
    );
}
