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
    return (
        <Wrapper
            dangerouslySetInnerHTML={{
                __html: kjua({
                    size: 256,
                    fill: '#2596A1',
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
