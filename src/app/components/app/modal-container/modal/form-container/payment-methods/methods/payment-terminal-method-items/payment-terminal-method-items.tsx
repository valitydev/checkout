import * as React from 'react';

import { FormInfo, KnownProviderCategories, PaymentTerminalPaymentMethod } from 'checkout/state';
import { assertUnreachable } from 'checkout/utils';
import { Locale } from 'checkout/locale';
import { OnlineBankingMethodItem } from './online-banking-method-item';
import { UPIPaymentMethodItem } from './upi-payment-method-item';
import { PaymentTerminalBankCardMethodItem } from './payment-terminal-bank-card-method-item';
import { PaymentRequestedPayload } from 'checkout/actions';

export interface PaymentTerminalMethodItemsProps {
    method: PaymentTerminalPaymentMethod;
    locale: Locale;
    setFormInfo: (formInfo: FormInfo) => any;
    pay: (payload: PaymentRequestedPayload) => any;
}

export const PaymentTerminalMethodItems: React.FC<PaymentTerminalMethodItemsProps> = ({
    method,
    locale,
    setFormInfo,
    pay
}) => {
    switch (method.category) {
        case KnownProviderCategories.OnlineBanking:
        case KnownProviderCategories.NetBanking:
            return <OnlineBankingMethodItem method={method} locale={locale} setFormInfo={setFormInfo} pay={pay} />;
        case KnownProviderCategories.UPI:
            return <UPIPaymentMethodItem category={method.category} setFormInfo={setFormInfo} />;
        case KnownProviderCategories.BankCard:
            return (
                <PaymentTerminalBankCardMethodItem
                    category={method.category}
                    locale={locale}
                    setFormInfo={setFormInfo}
                />
            );
        default:
            assertUnreachable(method.category);
            return null;
    }
};
