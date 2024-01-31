import { createContext } from 'react';

import { SlideAnimationDirection, ViewModel, ViewName } from './types';
import { StartPaymentPayload } from '../../common/paymentMgmt';

export type ViewModelContextProps = {
    viewModel: ViewModel | null;
    viewAmount: string;
    goTo: (viewName: ViewName, direction: SlideAnimationDirection) => void;
    onSetPaymentPayload: (payload: StartPaymentPayload) => void;
};

export const ViewModelContext = createContext<ViewModelContextProps>({
    viewModel: null,
    viewAmount: '',
    goTo: () => {},
    onSetPaymentPayload: () => {},
});
