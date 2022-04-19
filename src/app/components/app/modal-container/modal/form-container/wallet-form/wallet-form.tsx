import * as React from 'react';
import { useEffect } from 'react';
import { InjectedFormProps, reduxForm } from 'redux-form';
import get from 'lodash-es/get';

import { FormGroup } from '../form-group';
import { FormName, PaymentMethodName, PaymentStatus, WalletFormInfo, WalletFormValues } from 'checkout/state';
import { PayButton } from '../pay-button';
import { Header } from '../header';
import { Amount } from '../common-fields';
import { toFieldsConfig } from '../fields-config';
import { pay, setViewInfoError } from 'checkout/actions';
import { SignUp } from './sign-up';
import {
    getActiveModalFormSelector,
    getInitConfigSelector,
    getLocaleSelector,
    getModelSelector
} from 'checkout/selectors';
import { useAppDispatch, useAppSelector } from 'checkout/configure-store';
import { getMetadata, MetadataField, MetadataLogo, obscurePassword, sortByIndex } from 'checkout/components/ui';
import { LogoContainer } from './logo-container';

const WalletFormDef: React.FC<InjectedFormProps> = ({ submitFailed, initialize, handleSubmit }) => {
    const locale = useAppSelector(getLocaleSelector);
    const initConfig = useAppSelector(getInitConfigSelector);
    const model = useAppSelector(getModelSelector);
    const { activeProvider, paymentStatus } = useAppSelector<WalletFormInfo>(getActiveModalFormSelector);
    const dispatch = useAppDispatch();
    const formValues = useAppSelector((s) => get(s.form, 'walletForm.values'));
    const { form, logo, signUpLink } = getMetadata(activeProvider);
    const amount = toFieldsConfig(initConfig, model.invoiceTemplate).amount;

    const submit = (values: WalletFormValues) => {
        dispatch(
            pay({
                method: PaymentMethodName.DigitalWallet,
                values: form ? obscurePassword(form, values) : values
            })
        );
    };

    useEffect(() => {
        dispatch(setViewInfoError(false));
        switch (paymentStatus) {
            case PaymentStatus.pristine:
                initialize({
                    amount: formValues?.amount,
                    provider: activeProvider.id
                });
                break;
            case PaymentStatus.needRetry:
                submit(formValues);
                break;
        }
    }, []);

    useEffect(() => {
        if (submitFailed) {
            dispatch(setViewInfoError(true));
        }
    }, [submitFailed]);

    return (
        <form id="wallet-form" onSubmit={handleSubmit(submit)}>
            {activeProvider && (
                <>
                    <Header title={activeProvider.brandName} />
                    {logo && (
                        <LogoContainer>
                            <MetadataLogo metadata={logo} />
                        </LogoContainer>
                    )}
                    {form?.sort(sortByIndex).map((m) => (
                        <FormGroup key={m.name}>
                            <MetadataField locale={locale} metadata={m} localeCode={initConfig.locale} />
                        </FormGroup>
                    ))}
                    {amount.visible && (
                        <FormGroup>
                            <Amount cost={amount.cost} />
                        </FormGroup>
                    )}
                    <PayButton />
                    {signUpLink && <SignUp locale={locale} link={signUpLink} />}
                </>
            )}
        </form>
    );
};

export const WalletForm = reduxForm({
    form: FormName.walletForm,
    destroyOnUnmount: false
})(WalletFormDef);
