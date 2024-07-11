import { useTheme } from '@chakra-ui/react';
import kjua from 'kjua';
import styled from 'styled-components';

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
`;

export type QRCodeProps = {
    text: string;
};

export function QRCode({ text }: QRCodeProps) {
    const {
        qrCode: { back, fill },
    } = useTheme();
    return (
        <Wrapper
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
