import * as React from 'react';
import { connect } from 'react-redux';
import { Field } from 'redux-form';

import { KnownDigitalWalletProviders, State } from 'checkout/state';
import { CustomInputProps, getCustomInput } from './get-custom-input';

const validateAccount = (value: string): boolean => !value || !value.trim();

const VenusPointAccountDef: React.FC<CustomInputProps> = (props) => (
    <Field name="venusPointAccount" component={getCustomInput.bind(null, props)} validate={validateAccount} />
);

const mapStateToProps = (state: State) => ({
    id: 'venus-point-account-input',
    placeholder: state.config.locale['digital.wallet.providers'][KnownDigitalWalletProviders.Venuspoint].fields.account,
    type: 'text'
});

export const VenusPointAccount = connect(mapStateToProps)(VenusPointAccountDef);
