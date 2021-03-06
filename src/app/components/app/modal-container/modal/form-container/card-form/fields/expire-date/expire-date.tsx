import * as React from 'react';
import { connect } from 'react-redux';
import { Field, WrappedFieldProps } from 'redux-form';

import { State } from 'checkout/state';
import { validateExpireDate } from './validate-expire-date';
import { Locale } from 'checkout/locale';
import { formatExpiry } from './format-expiry';
import { Calendar, Input } from 'checkout/components';
import { isError } from 'checkout/utils';

export interface ExpireDateProps {
    locale: Locale;
}

const getCustomInput = (props: ExpireDateProps, fieldProps: WrappedFieldProps) => (
    <Input
        {...fieldProps.input}
        {...fieldProps.meta}
        error={isError(fieldProps.meta)}
        icon={<Calendar />}
        placeholder={props.locale['form.input.expiry.placeholder']}
        mark={true}
        type="tel"
        id="expire-date-input"
        onInput={formatExpiry}
        autocomplete="cc-exp"
    />
);

export const ExpireDateDef: React.FC<ExpireDateProps> = (props) => (
    <Field name="expireDate" component={getCustomInput.bind(null, props)} validate={validateExpireDate} />
);

const mapStateToProps = (state: State) => ({
    locale: state.config.locale
});

export const ExpireDate = connect(mapStateToProps)(ExpireDateDef);
