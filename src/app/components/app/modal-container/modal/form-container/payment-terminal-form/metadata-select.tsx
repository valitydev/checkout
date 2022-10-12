import * as React from 'react';
import { ServiceProviderMetadataSelect } from 'checkout/backend';
import { assertUnreachable } from 'checkout/utils';
import { CountrySubdivisionsMetadataSelect } from 'checkout/components';

export interface MetadataSelectProps {
    metadata: ServiceProviderMetadataSelect;
    localeCode: string;
    wrappedName: string;
}

export const MetadataSelect = ({ metadata, localeCode, wrappedName }: MetadataSelectProps) => {
    switch (metadata.src.type) {
        case 'countrySubdivisions': {
            return (
                <CountrySubdivisionsMetadataSelect
                    metadata={metadata}
                    localeCode={localeCode}
                    wrappedName={wrappedName}
                />
            );
        }
        default:
            assertUnreachable(metadata.src.type);
            return null;
    }
};
