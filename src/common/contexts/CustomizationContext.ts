import { createContext } from 'react';

const defaultContext: CustomizationContextProps = {
    localeCode: 'en',
    name: '',
    description: '',
};

export type CustomizationContextProps = {
    localeCode: string;
    name?: string;
    description?: string;
};

export const CustomizationContext = createContext<CustomizationContextProps>(defaultContext);
