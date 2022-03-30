import * as React from 'react';

import MC from './mc.svg';
import Visa from './visa.svg';
import RuPay from './ru_pay.svg';
import { BankCardProviderID } from '../provider-selector';

export const ProviderIcon: React.FC<{ providerID: BankCardProviderID }> = ({ providerID }) => {
    switch (providerID) {
        case 'MC ServiceObject':
            return <MC />;
        case 'VISA ServiceObject':
            return <Visa />;
        case 'RUPAY ServiceObject':
            return <RuPay />;
    }
};
