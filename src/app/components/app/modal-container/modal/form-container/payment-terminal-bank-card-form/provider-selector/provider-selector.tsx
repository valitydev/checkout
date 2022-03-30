import * as React from 'react';
import { useState } from 'react';

import styled from 'checkout/styled-components';
import { ServiceProvider } from 'checkout/backend';
import { ProviderPane } from './provider-pane';

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
