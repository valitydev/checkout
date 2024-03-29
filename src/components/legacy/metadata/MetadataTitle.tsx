import * as React from 'react';
import styled from 'styled-components';

import { MetadataTextLocalization, ServiceProviderTitleMetadata } from '../../../common/backend/payments';
import { PaymentMethodIcon } from '../PaymentMethodIcon';
import { PaymentMethodTitle } from '../PaymentMethodTitle';

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

export const MetadataTitle: React.FC<{
    localeCode: string;
    metadata: ServiceProviderTitleMetadata;
}> = ({ localeCode, metadata: { icon, localization } }) => (
    <Container>
        <PaymentMethodIcon name={icon} />
        <PaymentMethodTitle>{getText(localeCode, localization)}</PaymentMethodTitle>
    </Container>
);
