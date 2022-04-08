import * as React from 'react';
import { useEffect } from 'react';
import { InjectedFormProps, reduxForm } from 'redux-form';
import get from 'lodash-es/get';

import { FormGroup } from '../form-group';
import {
    FormName,
    KnownDigitalWalletProviders,
    PaymentMethodName,
    PaymentStatus,
    WalletFormInfo,
    WalletFormValues
} from 'checkout/state';
import { PayButton } from '../pay-button';
import { Header } from '../header';
import { Amount } from '../common-fields';
import { toFieldsConfig } from '../fields-config';
import { pay, setViewInfoError } from 'checkout/actions';
import { WalletProviderFormGroup } from './wallet-provider-form-group';
import { SignUp } from './sign-up';
import {
    getActiveModalFormSelector,
    getInitConfigSelector,
    getLocaleSelector,
    getModelSelector
} from 'checkout/selectors';
import { useAppDispatch, useAppSelector } from 'checkout/configure-store';
import { getLogoMetadata, MetadataLogo } from 'checkout/components/ui';
import styled from 'checkout/styled-components';

const LogoContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    margin-bottom: 20px;
`;

const WalletFormDef: React.FC<InjectedFormProps> = (props) => {
    const locale = useAppSelector(getLocaleSelector);
    const initConfig = useAppSelector(getInitConfigSelector);
    const model = useAppSelector(getModelSelector);
    const formInfo = useAppSelector<WalletFormInfo>(getActiveModalFormSelector);
    const logoMetadata = getLogoMetadata(formInfo.activeProvider);
    const dispatch = useAppDispatch();
    const amount = toFieldsConfig(initConfig, model.invoiceTemplate).amount;
    const formValues = useAppSelector((s) => get(s.form, 'walletForm.values'));

    const submit = (values: WalletFormValues) => {
        (document.activeElement as HTMLElement)?.blur();
        dispatch(pay({ method: PaymentMethodName.DigitalWallet, values }));
    };

    useEffect(() => {
        dispatch(setViewInfoError(false));
        switch (formInfo.paymentStatus) {
            case PaymentStatus.pristine:
                props.initialize({
                    amount: formValues?.amount,
                    provider: formInfo.activeProvider.id
                });
                break;
            case PaymentStatus.needRetry:
                submit(formValues);
                break;
        }
    }, []);

    useEffect(() => {
        if (props.submitFailed) {
            dispatch(setViewInfoError(true));
        }
    }, [props.submitFailed]);

    return (
        <form id="wallet-form" onSubmit={props.handleSubmit(submit)}>
            {formInfo.name === FormName.walletForm && (
                <div>
                    <Header title={formInfo.activeProvider.brandName} />
                    {logoMetadata && (
                        <LogoContainer>
                            <MetadataLogo metadata={logoMetadata} />
                        </LogoContainer>
                    )}
                    <WalletProviderFormGroup provider={formInfo.activeProvider.id as KnownDigitalWalletProviders} />
                    {amount.visible && (
                        <FormGroup>
                            <Amount cost={amount.cost} />
                        </FormGroup>
                    )}
                    <PayButton />
                    <SignUp locale={locale} provider={formInfo.activeProvider.id as KnownDigitalWalletProviders} />
                </div>
            )}
        </form>
    );
};

export const WalletForm = reduxForm({
    form: FormName.walletForm,
    destroyOnUnmount: false
})(WalletFormDef);
