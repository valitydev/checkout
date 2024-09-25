import { Center, useTheme } from '@chakra-ui/react';
import kjua from 'kjua';

export type QRCodeProps = {
    text: string;
};

export function QRCode({ text }: QRCodeProps) {
    const {
        QRCode: { back, fill },
    } = useTheme();
    return (
        <Center
            dangerouslySetInnerHTML={{
                __html: kjua({
                    size: 224,
                    back,
                    fill,
                    rounded: 100,
                    crisp: true,
                    ecLevel: 'H',
                    quiet: 0,
                    mode: 'plain',
                    text,
                }).outerHTML,
            }}
        />
    );
}
