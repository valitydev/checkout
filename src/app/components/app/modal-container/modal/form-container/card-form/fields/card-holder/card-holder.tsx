import * as React from 'react';
import { connect } from 'react-redux';
import { Field, WrappedFieldProps } from 'redux-form';

import { State } from 'checkout/state';
import { validateCardHolder } from './validate-card-holder';
import { Locale } from 'checkout/locale';
import { formatCardHolder } from './format-card-holder';
import { User, Input } from 'checkout/components';
import { isError } from 'checkout/utils';

export interface CardHolderProps {
    locale: Locale;
}

const getCustomInput = (props: CardHolderProps, fieldProps: WrappedFieldProps) => (
    <Input
        {...fieldProps.input}
        {...fieldProps.meta}
        error={isError(fieldProps.meta)}
        icon={<User />}
        placeholder={props.locale['form.input.cardholder.placeholder']}
        mark={true}
        id="card-holder-input"
        onInput={formatCardHolder}
        autocomplete="cc-name"
        spellcheck={false}
    />
);

export const CardHolderDef: React.FC<CardHolderProps> = (props) => (
    <Field name="cardHolder" component={getCustomInput.bind(null, props)} validate={validateCardHolder} />
);

const mapStateToProps = (state: State) => ({
    locale: state.config.locale
});

export const CardHolder = connect(mapStateToProps)(CardHolderDef);
