import * as React from 'react';
import { Validator } from 'redux-form/lib/Field';
import { useEffect, useMemo } from 'react';
import { Field, InjectedFormProps, reduxForm, WrappedFieldProps } from 'redux-form';
import { ReactSVG } from 'react-svg';

import { Header } from '../header';
import { useAppDispatch, useAppSelector } from 'checkout/configure-store';
import { getCurrentModalFormSelector } from 'checkout/selectors/get-current-modal-form-selector';
import {
    FormName,
    OnlineBankingAccountFormInfo,
    OnlineBankingAccountFormValues,
    PaymentMethodName
} from 'checkout/state';
import { FormGroup } from '../form-group';
import { Input } from 'checkout/components';
import styled from 'checkout/styled-components';
import { Amount } from '../common-fields';
import { toFieldsConfig } from '../fields-config';
import { Locale } from 'checkout/locale';
import { PayButton } from '../pay-button';
import { pay, setViewInfoError } from 'checkout/actions';
import { metadataNamespace, ServiceProviderMetadata, ServiceProviderMetadataField } from 'checkout/backend';
import { isError } from 'checkout/utils';
import { LOGO_BY_SERVICE_PROVIDER_ID } from 'checkout/constants';

const BankLogoWrapper = styled.div`
    margin: auto;
`;
const StyledLogo = styled(ReactSVG)`
    svg {
        width: auto;
        height: 48px;
        margin-bottom: 20px;
    }
`;

const createValidator = (field: ServiceProviderMetadataField): Validator => (value) =>
    (!!field.required && !value) || (!!field.pattern && !new RegExp(field.pattern).test(value));
const WrappedInput: React.FC<WrappedFieldProps & { locale: Locale; field: ServiceProviderMetadataField }> = ({
    locale,
    field,
    input,
    meta
}) => {
    return (
        <Input
            {...input}
            {...meta}
            type={field.type}
            name={field.name}
            placeholder={locale['form.pay.onlineBanking.' + field.name]}
            mark={true}
            error={isError(meta)}
        />
    );
};
const FormField: React.FC<{ field: ServiceProviderMetadataField }> = ({ field }) => {
    const validate = useMemo(() => createValidator(field), [field]);
    const locale = useAppSelector((s) => s.config.locale);

    return (
        <Field name={`metadata.${field.name}`} component={WrappedInput} props={{ locale, field }} validate={validate} />
    );
};

const OnlineBankingAccountFormRef: React.FC<InjectedFormProps> = (props) => {
    const formInfo = useAppSelector(getCurrentModalFormSelector) as OnlineBankingAccountFormInfo;
    const { amount } = useAppSelector((s) => toFieldsConfig(s.config.initConfig, s.model.invoiceTemplate));
    const { serviceProvider } = formInfo;
    const metadata: ServiceProviderMetadata = serviceProvider?.metadata;
    const dispatch = useAppDispatch();
    const logo = LOGO_BY_SERVICE_PROVIDER_ID[serviceProvider?.id];

    useEffect(() => {
        dispatch(setViewInfoError(false));
    }, []);
    useEffect(() => {
        if (props.submitFailed) {
            dispatch(setViewInfoError(true));
        }
    }, [props.submitFailed]);

    const submit = (values: OnlineBankingAccountFormValues) => {
        (document.activeElement as HTMLElement)?.blur();
        dispatch(
            pay({
                method: PaymentMethodName.OnlineBanking,
                values: { ...values, provider: serviceProvider.id } as OnlineBankingAccountFormValues
            })
        );
    };

    return (
        !!metadata && (
            <form onSubmit={props.handleSubmit(submit)}>
                <Header title={serviceProvider.brandName} />
                {!!logo && (
                    <BankLogoWrapper>
                        <StyledLogo src={logo.src} />
                    </BankLogoWrapper>
                )}
                {metadata[metadataNamespace].form?.map((field) => (
                    <FormGroup key={field.name}>
                        <FormField field={field} />
                    </FormGroup>
                ))}
                {amount.visible && (
                    <FormGroup>
                        <Amount cost={amount.cost} />
                    </FormGroup>
                )}
                <PayButton />
            </form>
        )
    );
};

export const OnlineBankingAccountForm = reduxForm({
    form: FormName.onlineBankingAccountForm,
    destroyOnUnmount: true
})(OnlineBankingAccountFormRef);
