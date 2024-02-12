import { createContext } from 'react';

import { ViewModel } from '../../components/ViewContainer';

export type ViewModelContextProps = {
    viewModel: ViewModel | null;
    viewAmount: string;
    goTo: (viewId: string) => void;
    forward: (viewId: string) => void;
    backward: () => void;
};

export const ViewModelContext = createContext<ViewModelContextProps>({
    viewModel: null,
    viewAmount: '',
    goTo: () => {},
    forward: () => {},
    backward: () => {},
});
