import * as React from 'react';
import { number } from 'card-validator';

import * as cardIcons from 'checkout/components/ui/icon/card';
import styled, { keyframes } from 'checkout/styled-components';

interface CardTypeIconProps {
    cardNumber: string;
    className?: string;
}

const growth = keyframes`
    from {
        transform: scale(0);
    }
    to {
        transform: scale(1);
    }
`;

const cardIconsMapping = {
    visa: cardIcons.Visa,
    mastercard: cardIcons.Mastercard,
    maestro: cardIcons.Maestro,
    mir: cardIcons.Mir,
    'american-express': cardIcons.AmericanExpress,
    'diners-club': cardIcons.DinersClub,
    discover: cardIcons.Discover,
    jcb: cardIcons.Jcb,
    unionpay: cardIcons.Unionpay,
    elo: cardIcons.Elo,
    hipercard: cardIcons.Hipercard
};

export function getCardIconClass(cardNumber: string) {
    const { card } = number(cardNumber);
    if (!card) {
        return;
    }
    return (cardIconsMapping as any)[card.type];
}

const CardTypeIconDef = styled<React.FC<CardTypeIconProps>>(({ cardNumber, className }) => {
    const Icon = getCardIconClass(cardNumber);
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

export const CardTypeIcon = ({ cardNumber }: CardTypeIconProps) => {
    return <CardTypeIconDef cardNumber={cardNumber} />;
};
