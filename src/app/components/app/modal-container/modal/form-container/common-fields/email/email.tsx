import * as React from 'react';
import { connect } from 'react-redux';
import { Field, WrappedFieldProps } from 'redux-form';

import { State } from 'checkout/state';
import { formatEmail, isError, validateEmail } from 'checkout/utils';
import { Locale } from 'checkout/locale';
import { Input } from 'checkout/components';

export interface EmailDefProps {
    locale: Locale;
}

const getCustomInput = (props: EmailDefProps, fieldProps: WrappedFieldProps) => (
    <Input
        {...fieldProps.input}
        {...fieldProps.meta}
        error={isError(fieldProps.meta)}
        placeholder={props.locale['form.input.email.placeholder']}
        mark={true}
        type="email"
        id="email-input"
        onInput={formatEmail}
        autocomplete="email"
    />
);

export const EmailDef: React.FC<EmailDefProps> = (props) => (
    <Field name="email" component={getCustomInput.bind(null, props)} validate={validateEmail} />
);

const mapStateToProps = (state: State) => ({
    locale: state.config.locale
});

export const Email = connect(mapStateToProps)(EmailDef);
