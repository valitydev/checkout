import { createContext } from 'react';

import { InitialData } from 'checkout/hooks';

export const InitialContext = createContext<InitialData>(null);
