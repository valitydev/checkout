import { createContext } from 'react';

export type CompletePaymentContextProps = {
    onComplete: () => void;
};

export const CompletePaymentContext = createContext<CompletePaymentContextProps>({
    onComplete: () => {},
});
