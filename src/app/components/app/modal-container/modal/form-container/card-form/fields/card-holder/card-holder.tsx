import * as React from 'react';
import { Field, WrappedFieldProps } from 'redux-form';

import { validateCardHolder } from './validate-card-holder';
import { Locale } from 'checkout/locale';
import { formatCardHolder } from './format-card-holder';
import { User, Input } from 'checkout/components';
import { isError } from 'checkout/utils';

export interface CardHolderProps {
    locale: Locale;
}

const WrappedInput = ({ input, meta, locale }: WrappedFieldProps & CardHolderProps) => (
    <Input
        {...input}
        {...meta}
        error={isError(meta)}
        icon={<User />}
        placeholder={locale['form.input.cardholder.placeholder']}
        mark={true}
        id="card-holder-input"
        onInput={formatCardHolder}
        autocomplete="cc-name"
        spellcheck={false}
    />
);

export const CardHolder = ({ locale }: CardHolderProps) => (
    <Field name="cardHolder" component={WrappedInput} props={{ locale }} validate={validateCardHolder} />
);
