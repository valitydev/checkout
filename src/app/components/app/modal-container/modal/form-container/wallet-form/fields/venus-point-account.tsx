import * as React from 'react';
import { connect } from 'react-redux';
import { Field } from 'redux-form';

import { KnownDigitalWalletProviders, State } from 'checkout/state';
import { formatEmail, validateEmail } from 'checkout/utils';
import { CustomInputProps, getCustomInput } from './get-custom-input';

const VenusPointAccountDef: React.FC<CustomInputProps> = (props) => (
    <Field name="venusPointAccount" component={getCustomInput.bind(null, props)} validate={validateEmail} />
);

const mapStateToProps = (state: State) => ({
    id: 'venus-point-account-input',
    placeholder: state.config.locale['digital.wallet.providers'][KnownDigitalWalletProviders.Venuspoint].fields.account,
    type: 'email',
    onInput: formatEmail,
    autocomplete: 'email'
});

export const VenusPointAccount = connect(mapStateToProps)(VenusPointAccountDef);
