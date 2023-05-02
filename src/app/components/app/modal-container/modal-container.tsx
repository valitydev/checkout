import * as React from 'react';

import { ModalContent } from './modal-content';
import styled from 'checkout/styled-components';
import { device } from 'checkout/utils/device';
import { fadein, fadeout, popup, popout } from 'checkout/styled-components/animations';
import { stylableTransition, APPEAR, ENTER, LEAVE, ACTIVE } from 'checkout/styled-transition';

const Animation = styled(stylableTransition)`
    ${APPEAR} {
        animation: ${fadein} 0.75s;

        @media ${device.desktop} {
            animation-name: ${popup};
        }
    }

    ${ENTER} {
        background: transparent;
    }

    ${LEAVE} {
        animation: ${fadeout} 0.75s;

        @media ${device.desktop} {
            animation-name: ${popout};
        }

        ${ACTIVE} {
            opacity: 0;
        }
    }
`;

const Container = styled.div`
    height: 100%;
    position: relative;
`;

export const ModalContainer = () => (
    <Animation enter={750} appear={750} leave={750}>
        <Container>
            <ModalContent />
        </Container>
    </Animation>
);
