import { createContext } from 'react';

import { ViewModel, SlideAnimationDirection } from '../../components/ViewContainer';

export type ViewModelContextProps = {
    viewModel: ViewModel | null;
    viewAmount: string;
    goTo: (viewId: string, direction?: SlideAnimationDirection) => void;
};

export const ViewModelContext = createContext<ViewModelContextProps>({
    viewModel: null,
    viewAmount: '',
    goTo: () => {},
});
