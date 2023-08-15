import { useContext, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { getMetadata, MetadataField, MetadataLogo, obscurePassword, sortByIndex } from 'checkout/components/ui';
import { ResultFormInfo, ResultType, WalletFormInfo, WalletFormValues } from 'checkout/hooks';
import { PaymentMethodName, useCreatePayment } from 'checkout/hooks';
import { isEmptyObject } from 'checkout/utils/is-empty-object';

import { LogoContainer } from './logo-container';
import { SignUp } from './sign-up';
import { InitialContext } from '../../../../initial-context';
import { ModalContext } from '../../../modal-context';
import { FormGroup } from '../form-group';
import { Header } from '../header';
import { PayButton } from '../pay-button';
import { useActiveModalForm } from '../use-active-modal-form';

export const WalletForm = ({ onMount }: { onMount: () => void }) => {
    const { locale, initConfig } = useContext(InitialContext);
    const { modalState, goToFormInfo, prepareToPay, setViewInfoError } = useContext(ModalContext);
    const { createPaymentState, setFormData } = useCreatePayment();
    const { activeProvider } = useActiveModalForm<WalletFormInfo>(modalState);
    const { form, logo, signUpLink } = getMetadata(activeProvider);
    const {
        register,
        handleSubmit,
        formState: { errors, dirtyFields, isSubmitted },
    } = useForm<WalletFormValues>({
        mode: 'onChange',
    });

    useEffect(() => {
        onMount();
    }, []);

    useEffect(() => {
        if (isSubmitted && !isEmptyObject(errors)) {
            setViewInfoError(true);
        }
    }, [isSubmitted, errors]);

    useEffect(() => {
        if (createPaymentState.status === 'FAILURE') {
            goToFormInfo(
                new ResultFormInfo(ResultType.hookError, {
                    error: createPaymentState.error,
                }),
            );
        }
    }, [createPaymentState]);

    const onSubmit: SubmitHandler<WalletFormValues> = (values) => {
        prepareToPay();
        setFormData({
            method: PaymentMethodName.DigitalWallet,
            values: {
                provider: activeProvider?.id,
                ...(form ? obscurePassword(form, values) : values),
            },
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
                                fieldError={errors?.[m.name]}
                                isDirty={dirtyFields?.[m.name]}
                                localeCode={initConfig.locale}
                                metadata={m}
                                register={register}
                            />
                        </FormGroup>
                    ))}
                    <PayButton />
                    {signUpLink && <SignUp link={signUpLink} locale={locale} />}
                </>
            )}
        </form>
    );
};
