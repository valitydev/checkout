import * as React from 'react';

import styled, { keyframes, withTheme } from 'checkout/styled-components';
import { WithThemeProps } from 'checkout/themes';

export const spin = keyframes`
    100% {
        transform: rotate(360deg);
    }
`;

const LoaderWrapper = styled.svg`
    position: relative;
    width: 64px;
    height: 64px;
    animation: ${spin} 1s linear infinite;
`;

const LoaderDef: React.FC<WithThemeProps> = ({ theme }) => (
    <LoaderWrapper width="64px" height="64px" viewBox="0 0 57 57">
        <defs>
            <linearGradient x1="100%" y1="0%" x2="0%" y2="100%" id="gradient">
                {theme.background.loader.map((color, idx) => (
                    <stop key={idx} stopColor={color[0]} offset={color[1]} />
                ))}
            </linearGradient>
        </defs>
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g transform="translate(-655.000000, -383.000000)" strokeWidth="4" stroke={`url(#gradient)`}>
                <circle cx="683.5" cy="411.5" r="26.5" />
            </g>
        </g>
    </LoaderWrapper>
);

export const Loader = withTheme(LoaderDef);
