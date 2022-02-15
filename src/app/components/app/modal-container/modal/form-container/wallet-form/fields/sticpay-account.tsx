import * as React from 'react';
import { connect } from 'react-redux';
import { Field, WrappedFieldProps } from 'redux-form';

import { State } from 'checkout/state';
import { Locale } from 'checkout/locale';
import { Letter } from 'checkout/components';
import { Input } from '../../input';
import { formatEmail, isError, validateEmail } from '../../common-fields';

export interface EmailDefProps {
    locale: Locale;
}

const getCustomInput = (props: EmailDefProps, fieldProps: WrappedFieldProps) => (
    <Input
        {...fieldProps.input}
        {...fieldProps.meta}
        error={isError(fieldProps.meta)}
        icon={<Letter />}
        placeholder={props.locale['digital.wallet.providers'].sticpay.fields.account}
        mark={true}
        type="email"
        id="sticpay-account-input"
        onInput={formatEmail}
        autocomplete="email"
    />
);

export const SticpayAccountDef: React.FC<EmailDefProps> = (props) => (
    <Field name="sticpayAccount" component={getCustomInput.bind(null, props)} validate={validateEmail} />
);

const mapStateToProps = (state: State) => ({
    locale: state.config.locale
});

export const SticpayAccount = connect(mapStateToProps)(SticpayAccountDef);
