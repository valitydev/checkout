import { createContext } from 'react';

import { PaymentPayload, SlideAnimationDirection, ViewModel, ViewName } from './types';

export type ViewModelContextProps = {
    viewModel: ViewModel | null;
    goTo: (viewName: ViewName, direction: SlideAnimationDirection) => void;
    onSetPaymentPayload: (payload: PaymentPayload) => void;
};

export const ViewModelContext = createContext<ViewModelContextProps>({
    viewModel: null,
    goTo: () => {},
    onSetPaymentPayload: () => {},
});
