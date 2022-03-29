import * as React from 'react';
import { useState } from 'react';
import { Field, WrappedFieldProps } from 'redux-form';

import styled, { css } from 'checkout/styled-components';
import MC from './icons/mc.svg';
import Visa from './icons/visa.svg';
import RuPay from './icons/ru_pay.svg';
import { isError } from 'checkout/utils';
import { ServiceProvider } from 'checkout/backend';

const ProviderIcon: React.FC<{ providerID: BankCardProviderID }> = ({ providerID }) => {
    switch (providerID) {
        case 'MC ServiceObject':
            return <MC />;
        case 'VISA ServiceObject':
            return <Visa />;
        case 'RUPAY ServiceObject':
            return <RuPay />;
    }
};

const ProviderPaneContainer = styled.div<{ isActive?: boolean; isError: boolean }>`
    cursor: pointer;

    width: 78px;
    height: 46px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.color.neutral[0.2]};

    display: flex;
    align-items: center;
    justify-content: center;

    :hover {
        border-color: ${({ theme }) => theme.color.primary[1]};
    }

    ${({ isActive }) => {
        if (isActive) {
            return css`
                border: 2px solid ${({ theme }) => theme.color.primary[1]};
            `;
        }
    }}

    ${({ isError }) => {
        if (isError) {
            return css`
                border-color: ${({ theme }) => theme.color.error[1]};
            `;
        }
    }}
`;

export const ProviderPane: React.FC<{ providerID: BankCardProviderID; isActive: boolean; isError: boolean }> = ({
    providerID,
    isActive,
    isError
}) => (
    <ProviderPaneContainer isActive={isActive} isError={isError}>
        <ProviderIcon providerID={providerID} />
    </ProviderPaneContainer>
);

const ProviderSelectorContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

export type BankCardProviderID = 'VISA ServiceObject' | 'MC ServiceObject' | 'RUPAY ServiceObject';

export interface ProviderSelectorProps {
    providers: ServiceProvider[];
    onSelect: (providerID: BankCardProviderID) => void;
    isError: boolean;
}

const bankCardProviderReducer = (result: BankCardProviderID[], { id }: ServiceProvider): BankCardProviderID[] => {
    switch (id) {
        case 'VISA ServiceObject':
        case 'MC ServiceObject':
        case 'RUPAY ServiceObject':
            return result.concat(id);
        default:
            return result;
    }
};

export const ProviderSelector: React.FC<ProviderSelectorProps> = ({
    providers,
    onSelect,
    isError
}: ProviderSelectorProps) => {
    const [activePane, setActivePane] = useState(null);
    return (
        <ProviderSelectorContainer>
            {providers.reduce(bankCardProviderReducer, []).map((providerID) => (
                <div
                    onClick={() => {
                        setActivePane(providerID);
                        onSelect(providerID);
                    }}
                    key={providerID}>
                    <ProviderPane providerID={providerID} isActive={activePane === providerID} isError={isError} />
                </div>
            ))}
        </ProviderSelectorContainer>
    );
};

const WrappedControl: React.FC<WrappedFieldProps & { providers: ServiceProvider[] }> = ({
    providers,
    input: { onChange },
    meta
}) => <ProviderSelector providers={providers} onSelect={onChange} isError={isError(meta)} />;

const validateProvider = (value: string): boolean => !value;

export const ProviderSelectorField: React.FC<{ providers: ServiceProvider[] }> = ({ providers }) => (
    <Field name="provider" component={WrappedControl} props={{ providers }} validate={validateProvider} />
);
