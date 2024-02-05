import * as React from 'react';
import styled from 'styled-components';

import { ReactComponent as BankCard } from './bank-card.svg';
import { ReactComponent as OnlineBanking } from './online-banking.svg';
import { ReactComponent as Terminals } from './terminals.svg';
import { ReactComponent as Wallets } from './wallets.svg';

const IconClasses = {
    'bank-card': BankCard,
    terminals: Terminals,
    wallets: Wallets,
    'online-banking': OnlineBanking,
};

type name = keyof typeof IconClasses;

export const PaymentMethodIcon = styled<React.FC<{ name: name; className?: string }>>((props) => {
    const IconClass: any = IconClasses[props.name];

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
