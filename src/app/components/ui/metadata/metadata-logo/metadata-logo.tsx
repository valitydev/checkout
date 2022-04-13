import * as React from 'react';

import { ServiceProviderLogoMetadata } from 'checkout/backend';
import styled from 'checkout/styled-components';

const MetadataImage = styled.img<{ height: string; width: string }>`
    height: ${({ height }) => height};
    width: ${({ width }) => width};
`;

export const MetadataLogo: React.FC<{ metadata: ServiceProviderLogoMetadata }> = ({
    metadata: { height, width, src }
}) => <MetadataImage height={height} width={width} src={src} />;
