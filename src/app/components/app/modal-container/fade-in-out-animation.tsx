import styled from 'checkout/styled-components';
import { device } from 'checkout/utils/device';
import { fadein, fadeout, popup, popout } from 'checkout/styled-components/animations';
import { stylableTransition, APPEAR, ENTER, LEAVE, ACTIVE } from 'checkout/styled-transition';

export const FadeInOutAnimation = styled(stylableTransition)`
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
