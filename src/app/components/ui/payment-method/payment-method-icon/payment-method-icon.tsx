import * as React from 'react';
import styled from 'styled-components';

import BankCard from './bank-card.svg';
import Terminals from './terminals.svg';
import Wallets from './wallets.svg';
import OnlineBanking from './online-banking.svg';

const IconClasses = {
    'bank-card': BankCard,
    terminals: Terminals,
    wallets: Wallets,
    'online-banking': OnlineBanking,
};

type name = keyof typeof IconClasses;

export const PaymentMethodIcon = styled<React.FC<{ name: name; className?: string }>>((props) => {
    const IconClass = IconClasses[props.name];
    return (
        <div className={props.className}>
            <IconClass />
        </div>
    );
})`
    height: 40px;
    width: 40px;
    margin-right: 15px;

    path {
        fill: ${({ theme }) => theme.paymentMethodItem.color};
    }
`;
