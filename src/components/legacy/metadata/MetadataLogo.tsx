import * as React from 'react';
import styled from 'styled-components';

import { ServiceProviderIconMetadata } from '../../../common/backend/payments';

const MetadataImage = styled.img<{ height: string; width: string }>`
    height: ${({ height }) => height};
    width: ${({ width }) => width};
`;

export const MetadataLogo: React.FC<{
    metadata: ServiceProviderIconMetadata;
}> = ({ metadata: { height, width, src } }) => <MetadataImage height={height} src={src} width={width} />;
