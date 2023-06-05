import { createContext } from 'react';

export const ResultContext = createContext<{
    setIsComplete: (isComplete: boolean) => void;
}>(null);
