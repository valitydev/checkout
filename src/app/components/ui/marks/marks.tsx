import * as React from 'react';

import { Checkmark } from 'checkout/components/ui/icon';
import styled, { css } from 'checkout/styled-components';
import { stylableTransition, APPEAR, ENTER, LEAVE } from 'checkout/styled-transition';
import { fadein, fadeout } from 'checkout/styled-components/animations';

const FadeAnimation = styled(stylableTransition).attrs({
    appear: 450,
    leave: 450,
    enter: 450
})`
    ${APPEAR}, ${ENTER} {
        animation: ${fadein} 0.5s;
    }

    ${LEAVE} {
        animation: ${fadeout} 0.5s;
    }
`;

const iconStyle = css`
    display: flex;
    position: absolute;
    right: 0;
    top: 0;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
`;

const CheckmarkIcon = styled(Checkmark)`
    ${iconStyle};
    height: 9px;
    width: 13px;
    margin: 19px 15px 0 19px;
    g {
        stroke: ${({ theme }) => theme.icons.checkmark};
    }
`;

interface MarksProps {
    active: boolean;
    pristine: boolean;
    error: boolean;
}

export const Marks: React.FC<MarksProps> = ({ active, error, pristine }) => (
    <FadeAnimation>{!active && !error && !pristine && <CheckmarkIcon />}</FadeAnimation>
);
