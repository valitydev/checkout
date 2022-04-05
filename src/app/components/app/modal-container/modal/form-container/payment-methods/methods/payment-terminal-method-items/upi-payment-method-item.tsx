import * as React from 'react';
import isNil from 'lodash-es/isNil';

import { FormName, PaymentTerminalPaymentMethod } from 'checkout/state';
import { PaymentMethodItemContainer, UPILogo } from 'checkout/components/ui';
import { UPIFormInfo } from 'checkout/state/modal/form-info/upi-form-info';
import { PayAction, SetFormInfoAction } from './types';
import { payWithPaymentTerminal } from './pay-with-payment-terminal';

export interface UPIPaymentMethodItemProps {
    method: PaymentTerminalPaymentMethod;
    setFormInfo: SetFormInfoAction;
    pay: PayAction;
}

const toUPI = (setFormInfo: SetFormInfoAction) => setFormInfo(new UPIFormInfo(FormName.paymentMethods));

const provideMethod = (
    { serviceProviders }: PaymentTerminalPaymentMethod,
    pay: PayAction,
    setFormInfo: SetFormInfoAction
) => (isNil(serviceProviders[0].metadata) ? payWithPaymentTerminal(serviceProviders[0].id, pay) : toUPI(setFormInfo));

export const UPIPaymentMethodItem: React.FC<UPIPaymentMethodItemProps> = ({ method, pay, setFormInfo }) => (
    <PaymentMethodItemContainer id="upi-payment-method-item" onClick={() => provideMethod(method, pay, setFormInfo)}>
        <UPILogo />
    </PaymentMethodItemContainer>
);
