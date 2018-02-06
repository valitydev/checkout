import * as React from 'react';
import { connect } from 'react-redux';
import { Field, WrappedFieldInputProps, WrappedFieldProps } from 'redux-form';
import { IconType } from 'checkout/components';
import { State } from 'checkout/state';
import { Input } from '../../../input';
import { expireDateFormatter } from '../format';
import { validateExpireDate } from '../validation';
import { Locale } from 'checkout/locale';
import { isError } from '../../../common-fields/error-predicate';

type FieldProps = WrappedFieldInputProps & WrappedFieldProps;

export interface ExpireDateDefProps {
    locale: Locale;
}

const mapStateToProps = (state: State) => ({
    locale: state.config.locale
});

const CustomInput: React.SFC<FieldProps & ExpireDateDefProps> = (props) => (
    <Input
        {...props.input}
        {...props.meta}
        error={isError(props.meta)}
        formatter={expireDateFormatter}
        icon={IconType.calendar}
        placeholder={props.locale['form.input.expiry.placeholder']}
        mark={true}
        type='tel'
        id='expire-date-input'
    />
);

export const ExpireDateDef: React.SFC<ExpireDateDefProps> = (props) => (
    <Field
        name='expireDate'
        component={(fieldProps: FieldProps) => CustomInput({...fieldProps, ...props})}
        validate={validateExpireDate}
    />
);

export const ExpireDate = connect(mapStateToProps)(ExpireDateDef);