import styled from 'checkout/styled-components';
import { device } from 'checkout/utils/device';
import { stylableTransition, LEAVE, ENTER, ACTIVE } from 'checkout/styled-transition';

const interactionTransitionTime = '0.5s';

export const RotateAnimation = styled(stylableTransition)`
    ${ENTER} {
        opacity: 0;

        @media ${device.desktop} {
            opacity: 1;
            transform: perspective(1000px) rotateY(90deg);
        }

        ${ACTIVE} {
            opacity: 1;
            transition: all ${interactionTransitionTime} ease-out;

            @media ${device.desktop} {
                transform: perspective(1000px) rotateY(0deg);
                transition-delay: ${interactionTransitionTime};
            }
        }
    }

    ${LEAVE} {
        opacity: 1;

        @media ${device.desktop} {
            transform: translateY(-50%) perspective(1000px) rotateY(0deg);
            position: absolute;
            top: 50%;
        }

        ${ACTIVE} {
            opacity: 0;
            transition: all ${interactionTransitionTime} ease-in;

            @media ${device.desktop} {
                opacity: 1;
                top: 50%;
                transform: translateY(-50%) perspective(1000px) rotateY(-90deg);
            }
        }
    }
`;
