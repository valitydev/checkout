import * as React from 'react';
import { connect } from 'react-redux';
import { Field } from 'redux-form';

import { KnownDigitalWalletProviders, State } from 'checkout/state';
import { CustomInputProps, getCustomInput } from './get-custom-input';

const validatePassword = (value: string): boolean => !value || !value.trim();

const VenusPointPasswordDef: React.FC<CustomInputProps> = (props) => (
    <Field name="venusPointPassword" component={getCustomInput.bind(null, props)} validate={validatePassword} />
);

const mapStateToProps = (state: State) => ({
    id: 'venus-point-password-input',
    placeholder:
        state.config.locale['digital.wallet.providers'][KnownDigitalWalletProviders.Venuspoint].fields.password,
    type: 'password'
});

export const VenusPointPassword = connect(mapStateToProps)(VenusPointPasswordDef);
