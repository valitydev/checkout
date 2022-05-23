import * as React from 'react';
import * as kjua from 'kjua';

export const QRCode: React.FC<{ text: string }> = ({ text }) => (
    <div
        dangerouslySetInnerHTML={{
            __html: kjua({
                size: 300,
                fill: '#2596A1',
                rounded: 100,
                crisp: true,
                ecLevel: 'H',
                quiet: 0,
                mode: 'plain',
                text
            }).outerHTML
        }}
    />
);
