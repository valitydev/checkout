import { createContext } from 'react';

import { InitialState } from './use-initialize-app';

export const InitialContext = createContext<InitialState>(null);
