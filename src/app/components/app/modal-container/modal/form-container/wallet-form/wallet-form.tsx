import * as React from 'react';
import { useContext, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { FormGroup } from '../form-group';
import { ResultFormInfo, ResultType, WalletFormInfo } from 'checkout/hooks';
import { WalletFormValues } from 'checkout/state';
import { PayButton } from '../pay-button';
import { Header } from '../header';
import { SignUp } from './sign-up';
import { getMetadata, MetadataField, MetadataLogo, obscurePassword, sortByIndex } from 'checkout/components/ui';
import { LogoContainer } from './logo-container';
import { PaymentMethodName, useCreatePayment } from 'checkout/hooks';
import { useActiveModalForm } from '../use-active-modal-form';
import { isEmptyObject } from 'checkout/utils/is-empty-object';

import { InitialContext } from '../../../../initial-context';
import { ModalContext } from '../../../modal-context';

export const WalletForm = () => {
    const { locale, initConfig } = useContext(InitialContext);
    const { modalState, goToFormInfo, prepareToPay, setViewInfoError } = useContext(ModalContext);
    const { createPaymentState, setFormData } = useCreatePayment();
    const { activeProvider } = useActiveModalForm<WalletFormInfo>(modalState);
    const { form, logo, signUpLink } = getMetadata(activeProvider);
    const {
        register,
        handleSubmit,
        formState: { errors, dirtyFields, isSubmitted }
    } = useForm<WalletFormValues>({
        mode: 'onChange'
    });

    useEffect(() => {
        if (isSubmitted && !isEmptyObject(errors)) {
            setViewInfoError(true);
        }
    }, [isSubmitted, errors]);

    useEffect(() => {
        if (createPaymentState.status === 'FAILURE') {
            goToFormInfo(
                new ResultFormInfo(ResultType.hookError, {
                    error: createPaymentState.error
                })
            );
        }
    }, [createPaymentState]);

    const onSubmit: SubmitHandler<WalletFormValues> = (values) => {
        prepareToPay();
        setFormData({
            method: PaymentMethodName.DigitalWallet,
            values: {
                provider: activeProvider?.id,
                ...(form ? obscurePassword(form, values) : values)
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
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
                            <MetadataField
                                metadata={m}
                                localeCode={initConfig.locale}
                                register={register}
                                fieldError={errors?.[m.name]}
                                isDirty={dirtyFields?.[m.name]}
                            />
                        </FormGroup>
                    ))}
                    <PayButton />
                    {signUpLink && <SignUp locale={locale} link={signUpLink} />}
                </>
            )}
        </form>
    );
};
