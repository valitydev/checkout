import { createContext } from 'react';

const defaultContext: CustomizationContextProps = {
    localeCode: 'en',
    name: '',
    description: '',
    obscureCardCvv: true,
    requireCardHolder: true,
};

export type CustomizationContextProps = {
    localeCode: string;
    obscureCardCvv: boolean;
    requireCardHolder: boolean;
    name?: string;
    description?: string;
};

export const CustomizationContext = createContext<CustomizationContextProps>(defaultContext);
