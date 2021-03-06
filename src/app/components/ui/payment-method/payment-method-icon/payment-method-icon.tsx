import * as React from 'react';

import styled from 'checkout/styled-components';
import ApplePay from './apple-pay.svg';
import BankCard from './bank-card.svg';
import GooglePay from './google-pay.svg';
import SamsungPay from './samsung-pay.svg';
import Terminals from './terminals.svg';
import Wallets from './wallets.svg';
import MobileCommerce from './mobile-commerce.svg';
import YandexPay from './yandex-pay.svg';
import OnlineBanking from './online-banking.svg';

const IconClasses = {
    'apple-pay': ApplePay,
    'google-pay': GooglePay,
    'samsung-pay': SamsungPay,
    'yandex-pay': YandexPay,
    'bank-card': BankCard,
    terminals: Terminals,
    wallets: Wallets,
    'mobile-commerce': MobileCommerce,
    'online-banking': OnlineBanking
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
        fill: ${({ theme }) => theme.color.secondary[0.9]};
    }
`;
