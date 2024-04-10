import { createContext } from 'react';

const defaultContext: CustomizationContextProps = {
    initLocaleCode: 'en',
    name: '',
    description: '',
    obscureCardCvv: true,
    requireCardHolder: true,
};

export type CustomizationContextProps = {
    initLocaleCode: string;
    obscureCardCvv: boolean;
    requireCardHolder: boolean;
    name?: string;
    description?: string;
};

export const CustomizationContext = createContext<CustomizationContextProps>(defaultContext);
