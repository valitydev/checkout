import * as React from 'react';
import styled, { keyframes, withTheme } from 'styled-components';

import { WithThemeProps } from '../../common/theme';

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
    <LoaderWrapper height="64px" viewBox="0 0 57 57" width="64px">
        <defs>
            <linearGradient id="gradient" x1="100%" x2="0%" y1="0%" y2="100%">
                {theme.background.loader.map((color, idx) => (
                    <stop key={idx} offset={color[1]} stopColor={color[0]} />
                ))}
            </linearGradient>
        </defs>
        <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
            <g stroke={`url(#gradient)`} strokeWidth="4" transform="translate(-655.000000, -383.000000)">
                <circle cx="683.5" cy="411.5" r="26.5" />
            </g>
        </g>
    </LoaderWrapper>
);

export const Loader = withTheme(LoaderDef);
