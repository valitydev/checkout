import * as React from 'react';

import { ServiceProviderIconMetadata } from 'checkout/backend';
import styled from 'checkout/styled-components';

const MetadataImage = styled.img<{ height: string; width: string }>`
    height: ${({ height }) => height};
    width: ${({ width }) => width};
`;

export const MetadataLogo: React.FC<{ metadata: ServiceProviderIconMetadata }> = ({
    metadata: { height, width, src }
}) => <MetadataImage height={height} width={width} src={src} />;
