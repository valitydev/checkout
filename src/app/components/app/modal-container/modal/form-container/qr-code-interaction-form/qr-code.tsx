import * as React from 'react';
import kjua from 'kjua';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    justify-content: center;
`;

export const QRCode: React.FC<{ text: string }> = ({ text }) => (
    <Container
        dangerouslySetInnerHTML={{
            __html: kjua({
                size: 296,
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
