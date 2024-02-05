import { createContext } from 'react';

import { ViewModel } from '../../components/ViewContainer/types';

export type ViewModelContextProps = {
    viewModel: ViewModel | null;
    viewAmount: string;
};

export const ViewModelContext = createContext<ViewModelContextProps>({
    viewModel: null,
    viewAmount: '',
});
