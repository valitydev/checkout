import * as React from 'react';

import { KnownProviderCategories, PaymentTerminalPaymentMethod } from 'checkout/hooks';
import { assertUnreachable } from 'checkout/utils';
import { Locale } from 'checkout/locale';
import { PaymentTerminalBankCardMethodItem } from './payment-terminal-bank-card-method-item';
import { PayAction, SetFormInfoAction } from './types';
import { PaymentTerminalMethodItem } from './payment-terminal-method-item';
import { AppContext } from 'checkout/actions';

export interface PaymentTerminalMethodItemsProps {
    method: PaymentTerminalPaymentMethod;
    locale: Locale;
    setFormInfo: SetFormInfoAction;
    pay: PayAction;
    localeCode: string;
    emailPrefilled: boolean;
    phoneNumberPrefilled: boolean;
    context: AppContext;
}

export const PaymentTerminalMethodItems = ({
    method,
    locale,
    setFormInfo,
    pay,
    localeCode,
    emailPrefilled,
    phoneNumberPrefilled,
    context
}: PaymentTerminalMethodItemsProps) => {
    switch (method.category) {
        case KnownProviderCategories.UPI:
        case KnownProviderCategories.PIX:
        case KnownProviderCategories.PaymentTerminal:
        case KnownProviderCategories.DigitalWallet:
        case KnownProviderCategories.NetBanking:
        case KnownProviderCategories.OnlineBanking:
            return (
                <PaymentTerminalMethodItem
                    method={method}
                    setFormInfo={setFormInfo}
                    pay={pay}
                    localeCode={localeCode}
                    emailPrefilled={emailPrefilled}
                    phoneNumberPrefilled={phoneNumberPrefilled}
                    context={context}
                />
            );
        case KnownProviderCategories.BankCard:
            return <PaymentTerminalBankCardMethodItem locale={locale} setFormInfo={setFormInfo} />;
        default:
            assertUnreachable(method.category);
            return null;
    }
};
