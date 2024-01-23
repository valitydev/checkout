import { createContext } from 'react';

import { SlideAnimationDirection, ViewModel, ViewName } from './types';

export type ViewModelContextProps = {
    viewModel: ViewModel | null;
    goTo: (viewName: ViewName, direction: SlideAnimationDirection) => void;
};

export const ViewModelContext = createContext<ViewModelContextProps>({
    viewModel: null,
    goTo: () => {},
});
