import * as React from 'react';

import styled, { css } from 'checkout/styled-components';
import { stylableTransition, APPEAR, LEAVE, ACTIVE } from 'checkout/styled-transition';
import { fadein, fadeout } from 'checkout/styled-components/animations';

const Animation = styled(stylableTransition)`
    ${APPEAR} {
        animation: ${fadein} 0.75s;
    }

    ${LEAVE} {
        animation: ${fadeout} 0.75s;

        ${ACTIVE} {
            opacity: 0;
        }
    }
`;

const OverlayBg = styled.div`
    // Safari popup animation fix
    -webkit-transform: translateZ(-1000px);

    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    ${({ theme }) => {
        return css`
            background: ${theme.background.gradient};
        `;
    }}
`;

export const Overlay = () => (
    <Animation appear={750} leave={750}>
        <OverlayBg key="overlay" />
    </Animation>
);
