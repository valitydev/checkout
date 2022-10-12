import * as React from 'react';

import { countries, Country, CountrySubdivision } from 'checkout/utils';
import { MetadataSelectProps, MetadataSelect, SelectorOption } from './metadata-select';

const findCountry = (countryCode: string) => (country: Country) => country.code === countryCode;

const toOptions = ({ name, code }: CountrySubdivision): SelectorOption => ({ label: name, value: code });

export type CountrySubdivisionsMetadataSelectProps = Omit<MetadataSelectProps, 'options'>;

export const CountrySubdivisionsMetadataSelect = ({
    metadata,
    wrappedName,
    localeCode
}: CountrySubdivisionsMetadataSelectProps) => {
    const subdivisions = countries.find(findCountry(metadata.src.countryCode)).sub;
    const options = subdivisions.map(toOptions);
    return <MetadataSelect metadata={metadata} wrappedName={wrappedName} localeCode={localeCode} options={options} />;
};
