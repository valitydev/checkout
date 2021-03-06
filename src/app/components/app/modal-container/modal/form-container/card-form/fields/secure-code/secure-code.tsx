import * as React from 'react';
import { connect } from 'react-redux';
import { Field, WrappedFieldProps, formValueSelector } from 'redux-form';
import { number } from 'card-validator';
import { get } from 'lodash-es';

import { validateSecureCode } from './validate-secure-code';
import { State, FormName } from 'checkout/state';
import { Locale } from 'checkout/locale';
import { formatCVC } from './format-cvc';
import { Lock, Input } from 'checkout/components';
import { isError } from 'checkout/utils';

export interface SecureCodeProps {
    locale: Locale;
    obscureCardCvv: boolean;
    cardNumber: string;
}

const getCustomInput = (props: SecureCodeProps, fieldProps: WrappedFieldProps) => (
    <Input
        {...fieldProps.input}
        {...fieldProps.meta}
        error={isError(fieldProps.meta)}
        icon={<Lock />}
        placeholder={get(number(props.cardNumber), 'card.code.name', props.locale['form.input.secure.placeholder'])}
        mark={true}
        type={props.obscureCardCvv ? 'password' : 'tel'}
        id="secure-code-input"
        autocomplete="cc-csc"
    />
);

export const SecureCodeDef: React.FC<SecureCodeProps> = (props) => (
    <Field
        name="secureCode"
        component={getCustomInput.bind(null, props)}
        validate={validateSecureCode}
        normalize={(value, _p, { cardNumber }) => formatCVC(value, cardNumber)}
    />
);

const selector = formValueSelector(FormName.cardForm);

const mapStateToProps = (state: State) => ({
    locale: state.config.locale,
    obscureCardCvv: state.config.initConfig.obscureCardCvv,
    cardNumber: selector(state, 'cardNumber')
});

export const SecureCode = connect(mapStateToProps)(SecureCodeDef);
