import * as React from 'react';
import { connect } from 'react-redux';
import { Field, WrappedFieldProps } from 'redux-form';

import { Input } from 'checkout/components';
import { getPlaceholder } from './get-placeholder';
import { validateAmount } from './validate-amount';
import { Locale } from 'checkout/locale';
import { InvoiceTemplateLineCostRange, InvoiceTemplateLineCostUnlim } from 'checkout/backend';
import { State } from 'checkout/state';
import { formatAmount } from './format-amount';
import { Amount as AmountIcon } from 'checkout/components';
import { isError } from 'checkout/utils';

interface OwnProps {
    cost: InvoiceTemplateLineCostRange | InvoiceTemplateLineCostUnlim;
}

export interface AmountProps {
    cost: InvoiceTemplateLineCostRange | InvoiceTemplateLineCostUnlim;
    locale: Locale;
    localeCode: string;
}

const getCustomInput = (props: AmountProps, fieldProps: WrappedFieldProps) => (
    <Input
        {...fieldProps.input}
        {...fieldProps.meta}
        icon={<AmountIcon />}
        error={isError(fieldProps.meta)}
        placeholder={getPlaceholder(props.cost, props.locale['form.input.amount.placeholder'], props.localeCode)}
        mark={true}
        type="tel"
        id="amount-input"
        onInput={formatAmount}
    />
);

const AmountDef: React.FC<AmountProps> = (props) => (
    <Field
        name="amount"
        component={getCustomInput.bind(null, props)}
        validate={(value) => validateAmount(value, props.cost)}
    />
);

const mapStateToProps = (state: State, ownProps: OwnProps) => ({
    cost: ownProps.cost,
    locale: state.config.locale,
    localeCode: state.config.initConfig.locale
});

export const Amount = connect(mapStateToProps)(AmountDef);
