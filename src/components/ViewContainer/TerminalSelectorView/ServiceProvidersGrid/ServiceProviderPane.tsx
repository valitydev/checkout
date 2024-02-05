import * as React from 'react';
import styled from 'styled-components';

import {
    CheckoutServiceProviderMetadata,
    METADATA_NAMESPACE,
    ServiceProviderIconMetadata,
    ServiceProviderMetadata,
} from 'checkout/backend';

import { TerminalServiceProvider } from '../../../../common/paymentModel';
import { MetadataLogo } from '../../../../components/legacy';

const PaneContainer = styled.div`
    cursor: pointer;

    height: 64px;
    width: 140px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.paymentMethodItem.border};

    &:hover {
        border-color: ${({ theme }) => theme.paymentMethodItem.hover};
    }

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const PaneLabel = styled.p`
    overflow: hidden;
    white-space: nowrap;
    width: 126px;
    text-overflow: ellipsis;
    text-align: center;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
    margin: 0;
    user-select: none;
`;

const PaneLogoContainer = styled.div`
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
`;

const PaneLogo: React.FC<{ logo: ServiceProviderIconMetadata }> = ({ logo }) => (
    <PaneLogoContainer>
        <MetadataLogo metadata={logo} />
    </PaneLogoContainer>
);

export const getMetadata = (
    metadata: ServiceProviderMetadata | null,
    namespace = METADATA_NAMESPACE,
): CheckoutServiceProviderMetadata => metadata?.[namespace] || {};

export const ServiceProviderPane: React.FC<{
    serviceProvider: TerminalServiceProvider;
    onClick: (id: string) => void;
}> = ({ serviceProvider, onClick }) => {
    const { logo } = getMetadata(serviceProvider.metadata);
    return (
        <PaneContainer onClick={() => onClick(serviceProvider.id)}>
            {logo && <PaneLogo logo={logo} />}
            <PaneLabel>{serviceProvider.brandName}</PaneLabel>
        </PaneContainer>
    );
};
