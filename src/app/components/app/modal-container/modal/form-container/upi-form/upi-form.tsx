import * as React from 'react';
import { useEffect } from 'react';
import { InjectedFormProps, reduxForm } from 'redux-form';

import { useAppDispatch, useAppSelector } from 'checkout/configure-store';
import { setViewInfoError } from 'checkout/actions';
import { FormName } from 'checkout/state';
import { Header } from '../header';
import { PayButton } from '../pay-button';
import { Logo } from './logo';
import { FormGroup } from '../form-group';
import { PayerVirtualAddressField } from './payer-virtual-address-field';
import { InstructionItem } from './instruction-item';

const UPIFormRef: React.FC<InjectedFormProps> = (props) => {
    const dispatch = useAppDispatch();
    const locale = useAppSelector((s) => s.config.locale);

    useEffect(() => {
        dispatch(setViewInfoError(false));
    }, []);

    useEffect(() => {
        if (props.submitFailed) {
            dispatch(setViewInfoError(true));
        }
    }, [props.submitFailed]);

    const submit = () => {
        (document.activeElement as HTMLElement)?.blur();
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
