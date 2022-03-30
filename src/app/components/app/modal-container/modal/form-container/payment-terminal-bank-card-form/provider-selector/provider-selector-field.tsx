import * as React from 'react';
import { Field, WrappedFieldProps } from 'redux-form';

import { ServiceProvider } from 'checkout/backend';
import { isError } from 'checkout/utils';
import { ProviderSelector } from './provider-selector';

const WrappedControl: React.FC<WrappedFieldProps & { providers: ServiceProvider[] }> = ({
    providers,
    input: { onChange },
    meta
}) => <ProviderSelector providers={providers} onSelect={onChange} isError={isError(meta)} />;

const validateProvider = (value: string): boolean => !value;

export const ProviderSelectorField: React.FC<{ providers: ServiceProvider[] }> = ({ providers }) => (
    <Field name="provider" component={WrappedControl} props={{ providers }} validate={validateProvider} />
);
