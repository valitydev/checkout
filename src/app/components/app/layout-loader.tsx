import * as React from 'react';
import styled, { keyframes } from 'styled-components';

import { Loader } from '../ui/loader';
import { device } from 'checkout/utils/device';

const growth = keyframes`
    from {
        transform: scale(0);
    }
    to {
        transform: scale(1);
    }
`;

const LayoutLoaderWrapper = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    @media ${device.desktop} {
        position: relative;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        transform: translate(0, 0);
        animation: ${growth} 0.5s;
    }
`;

export const LayoutLoader = () => (
    <LayoutLoaderWrapper>
        <Loader />
    </LayoutLoaderWrapper>
);
