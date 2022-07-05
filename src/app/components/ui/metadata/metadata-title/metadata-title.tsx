import * as React from 'react';
import styled from 'checkout/styled-components';

import { MetadataTextLocalization, ServiceProviderTitleMetadata } from 'checkout/backend';
import { Icon } from 'checkout/components/app/modal-container/modal/form-container/payment-methods/methods/icon/icon';
import { Title } from 'checkout/components/app/modal-container/modal/form-container/payment-methods/methods/title';

const getText = (localeCode: string, localization: MetadataTextLocalization) =>
    localization[localeCode] || localization['en'];

export const Container = styled.div`
    padding: 20px;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
`;

export const MetadataTitle: React.FC<{ localeCode: string; metadata: ServiceProviderTitleMetadata }> = ({
    localeCode,
    metadata: { icon, localization }
}) => (
    <Container>
        <Icon name={icon} />
        <Title>{getText(localeCode, localization)}</Title>
    </Container>
);
