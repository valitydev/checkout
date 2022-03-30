import * as React from 'react';
import { useEffect } from 'react';
import { InjectedFormProps, reduxForm } from 'redux-form';

import { useAppDispatch, useAppSelector } from 'checkout/configure-store';
import { pay, setViewInfoError } from 'checkout/actions';
import { FormName, PaymentMethodName, PaymentTerminalFormValues, UPIFormInfo, UPIFormValues } from 'checkout/state';
import { Header } from '../header';
import { PayButton } from '../pay-button';
import { Logo } from './logo';
import { FormGroup } from '../form-group';
import { PayerVirtualAddressField } from './payer-virtual-address-field';
import { InstructionItem } from './instruction-item';
import { getActiveModalFormSelector, getAvailableTerminalPaymentMethodSelector } from 'checkout/selectors';

const UPIFormRef: React.FC<InjectedFormProps> = (props) => {
    const locale = useAppSelector((s) => s.config.locale);
    const { category } = useAppSelector<UPIFormInfo>(getActiveModalFormSelector);
    const paymentMethod = useAppSelector(getAvailableTerminalPaymentMethodSelector(category));
    const serviceProvider = paymentMethod?.serviceProviders[0];
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setViewInfoError(false));
    }, []);

    useEffect(() => {
        if (props.submitFailed) {
            dispatch(setViewInfoError(true));
        }
    }, [props.submitFailed]);

    const submit = ({ payerVirtualAddress }: UPIFormValues) => {
        (document.activeElement as HTMLElement)?.blur();
        dispatch(
            pay({
                method: PaymentMethodName.PaymentTerminal,
                values: {
                    metadata: {
                        payerVirtualAddress
                    },
                    provider: serviceProvider.id
                } as PaymentTerminalFormValues
            })
        );
    };

    return (
        <form onSubmit={props.handleSubmit(submit)}>
            <Header title={locale['form.header.pay.upi.label']} />
            <Logo />
            <FormGroup>
                <PayerVirtualAddressField locale={locale} />
            </FormGroup>
            <InstructionItem>{locale['form.pay.upi.instruction'][0]}</InstructionItem>
            <InstructionItem width="40%">{locale['form.pay.upi.instruction'][1]}</InstructionItem>
            <PayButton />
        </form>
    );
};

export const UPIForm = reduxForm({
    form: FormName.upiForm,
    destroyOnUnmount: true
})(UPIFormRef);
