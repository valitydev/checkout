import { useEffect } from 'react';

import { InitializationFailed, AppLayout } from './components';
import { useInitialize } from './useInitialize';

export function App() {
    const { state, init } = useInitialize();

    useEffect(() => {
        init();
    }, []);

    return (
        <>
            {state.status === 'SUCCESS' && <AppLayout initParams={state.data[1]} />}
            {state.status === 'FAILURE' && <InitializationFailed error={state.error} />}
        </>
    );
}
