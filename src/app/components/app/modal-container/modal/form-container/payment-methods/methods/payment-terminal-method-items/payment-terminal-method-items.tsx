import * as React from 'react';

import { FormInfo, KnownProviderCategories } from 'checkout/state';
import { assertUnreachable } from 'checkout/utils';
import { Locale } from 'checkout/locale';
import { OnlineBankingMethodItem } from './online-banking-method-item';
import { UPIPaymentMethodItem } from './upi-payment-method-item';
import { PaymentTerminalBankCardMethodItem } from './payment-terminal-bank-card-method-item';

export interface PaymentTerminalMethodItemsProps {
    category: KnownProviderCategories;
    locale: Locale;
    setFormInfo: (formInfo: FormInfo) => any;
}

export const PaymentTerminalMethodItems: React.FC<PaymentTerminalMethodItemsProps> = ({
    category,
    locale,
    setFormInfo
}) => {
    switch (category) {
        case KnownProviderCategories.OnlineBanking:
        case KnownProviderCategories.NetBanking:
            return <OnlineBankingMethodItem category={category} locale={locale} setFormInfo={setFormInfo} />;
        case KnownProviderCategories.UPI:
            return <UPIPaymentMethodItem category={category} setFormInfo={setFormInfo} />;
        case KnownProviderCategories.BankCard:
            return <PaymentTerminalBankCardMethodItem category={category} locale={locale} setFormInfo={setFormInfo} />;
        default:
            assertUnreachable(category);
            return null;
    }
};
