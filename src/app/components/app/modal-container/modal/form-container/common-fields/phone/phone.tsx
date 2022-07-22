import * as React from 'react';
import { connect } from 'react-redux';
import { Field, WrappedFieldProps } from 'redux-form';

import { State } from 'checkout/state';
import { Locale } from 'checkout/locale';
import { validatePhone } from './validate-phone';
import { formatPhoneNumber } from './format-phone-number';
import { Input } from 'checkout/components';
import { isError } from 'checkout/utils';

export interface PhoneProps {
    locale: Locale;
}

const getCustomInput = (props: PhoneProps, fieldProps: WrappedFieldProps) => (
    <Input
        {...fieldProps.input}
        {...fieldProps.meta}
        error={isError(fieldProps.meta)}
        placeholder={props.locale['form.input.phone.placeholder']}
        mark={true}
        type="tel"
        id="phone-input"
        onInput={formatPhoneNumber}
        onFocus={formatPhoneNumber}
        autocomplete="tel"
    />
);

export const PhoneDef: React.FC<PhoneProps> = (props) => (
    <Field name="phoneNumber" component={getCustomInput.bind(null, props)} validate={validatePhone} />
);

const mapStateToProps = (state: State) => ({
    locale: state.config.locale
});

export const Phone = connect(mapStateToProps)(PhoneDef);
