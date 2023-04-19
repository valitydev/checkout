import { createContext } from 'react';

import { InitialData } from './use-initialize-app';

export const InitialContext = createContext<InitialData>(null);
