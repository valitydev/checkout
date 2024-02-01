import { createContext } from 'react';

import { SlideAnimationDirection, ViewModel, ViewName } from '../../components/ViewContainer/types';

export type ViewModelContextProps = {
    viewModel: ViewModel | null;
    viewAmount: string;
    goTo: (viewName: ViewName, direction: SlideAnimationDirection) => void;
};

export const ViewModelContext = createContext<ViewModelContextProps>({
    viewModel: null,
    viewAmount: '',
    goTo: () => {},
});
