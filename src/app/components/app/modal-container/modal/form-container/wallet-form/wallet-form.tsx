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
import { getMetadata, MetadataField, MetadataLogo } from 'checkout/components/ui';
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
        const { name } = form.find((field) => field.type === 'password');
        if (name) {
            const passwordValue = values[name];
            console.log({
                [name]: 'md5password' + passwordValue
            });
        }
        dispatch(pay({ method: PaymentMethodName.DigitalWallet, values }));
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
                    {form?.map((fieldMetadata) => (
                        <FormGroup key={fieldMetadata.name}>
                            <MetadataField locale={locale} metadata={fieldMetadata} localeCode={initConfig.locale} />
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
