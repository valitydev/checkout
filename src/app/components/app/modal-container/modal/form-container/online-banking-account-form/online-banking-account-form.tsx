import * as React from 'react';

import { Header } from '../header';
import { useAppDispatch, useAppSelector } from 'checkout/configure-store';
import { getCurrentModalFormSelector } from 'checkout/selectors/get-current-modal-form-selector';
import { FormName, OnlineBankingAccountFormInfo, PayableFormValues, PaymentMethodName } from 'checkout/state';
import { FormGroup } from '../form-group';
import { Input } from 'checkout/components';
import styled from 'checkout/styled-components';
import { ReactSVG } from 'react-svg';
import { Amount } from '../common-fields';
import { toFieldsConfig } from '../fields-config';
import { Field, InjectedFormProps, reduxForm, WrappedFieldProps } from 'redux-form';
import { Locale } from 'checkout/locale';
import { Validator } from 'redux-form/lib/Field';
import { useMemo } from 'react';
import { PayButton } from 'checkout/components/app/modal-container/modal/form-container/pay-button';
import { pay } from 'checkout/actions';
import { ServiceProviderMetadata, ServiceProviderMetadataField } from 'checkout/backend';
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
    const logo = LOGO_BY_SERVICE_PROVIDER_ID[serviceProvider.id];

    const submit = (values: PayableFormValues) => {
        (document.activeElement as HTMLElement)?.blur();
        dispatch(pay({ method: PaymentMethodName.OnlineBanking, values }));
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
                {metadata.form?.map((field) => (
                    <FormGroup key={field.name}>
                        <FormField field={field} />
                    </FormGroup>
                ))}
                {/*{email.visible && (*/}
                {/*    <FormGroup>*/}
                {/*        <Email />*/}
                {/*    </FormGroup>*/}
                {/*)}*/}
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
    destroyOnUnmount: false
})(OnlineBankingAccountFormRef);
