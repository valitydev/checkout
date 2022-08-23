import * as React from 'react';

import { ServiceProvider } from 'checkout/backend';
import { getMetadata, MetadataLogo, MetadataTitle } from 'checkout/components';

export const MetadataContent: React.FC<{ serviceProvider: ServiceProvider; localeCode: string }> = ({
    serviceProvider,
    localeCode
}) => {
    const { logo, title } = getMetadata(serviceProvider);
    return (
        <>
            {title && <MetadataTitle metadata={title} localeCode={localeCode} />}
            {logo && <MetadataLogo metadata={logo} />}
        </>
    );
};
