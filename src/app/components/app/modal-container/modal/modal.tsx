import * as React from 'react';

import { Info } from './info';
import { FormContainer } from './form-container';
import { FormBlock } from './form-block';
import { Footer } from './footer';
import { stylableTransition, APPEAR, ENTER, LEAVE } from 'checkout/styled-transition';
import styled from 'checkout/styled-components';
import { device } from 'checkout/utils/device';
import { rotatein, rotateout } from 'checkout/styled-components/animations';

const RotateAnimation = styled(stylableTransition)`
    ${APPEAR} {
        @media ${device.desktop} {
            animation: ${rotatein} 0s;
        }
    }
    ${ENTER} {
        background: green;
    }
    ${LEAVE} {
        @media ${device.desktop} {
            animation: ${rotateout} 0s;
        }
    }
`;

export const Modal = () => (
    <RotateAnimation enter={1000} leave={1000} appear={1000}>
        <FormBlock id="form-container">
            <Info />
            <FormContainer />
        </FormBlock>
        <Footer />
    </RotateAnimation>
);
