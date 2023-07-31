import * as React from 'react';
import { number } from 'card-validator';
import styled, { keyframes } from 'styled-components';

import { ReactComponent as Mir } from './icon/card/mir.svg';
import { ReactComponent as Unionpay } from './icon/card/unionpay.svg';
import { ReactComponent as Visa } from './icon/card/visa.svg';
import { ReactComponent as Mastercard } from './icon/card/mastercard.svg';
import { ReactComponent as Maestro } from './icon/card/maestro.svg';

const growth = keyframes`
    from {
        transform: scale(0);
    }
    to {
        transform: scale(1);
    }
`;

const getIconInstance = (cardNumber: string) => {
    const { card } = number(cardNumber);
    if (!card) {
        return null;
    }
    switch (card.type) {
        case 'mir':
            return Mir;
        case 'unionpay':
            return Unionpay;
        case 'maestro':
            return Maestro;
        case 'mastercard':
            return Mastercard;
        case 'visa':
            return Visa;
        default:
            return null;
    }
};

type CardTypeIconProps = React.FC<{
    cardNumber: string;
    className?: string;
}>;

export const CardTypeIcon = styled<CardTypeIconProps>(({ cardNumber, className }) => {
    const Icon = getIconInstance(cardNumber);
    return Icon ? <Icon className={className} /> : null;
})`
    position: absolute;
    top: 15px;
    right: 15px;
    width: 31px;
    height: 19px;
    animation: ${growth} 0.5s;
    background: #fff;
`;
