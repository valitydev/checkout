import { Center, useTheme } from '@chakra-ui/react';
import { QRCodeSVG } from 'qrcode.react';

export type QRCodeProps = {
    value: string;
    size?: number;
};

export function QRCode({ value, size = 224 }: QRCodeProps) {
    const {
        colors,
        ViewContainer: { viewContainerBg },
    } = useTheme();

    return (
        <Center>
            <QRCodeSVG bgColor={viewContainerBg} fgColor={colors.brand[500]} size={size} value={value} />
        </Center>
    );
}
