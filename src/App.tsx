import { useEffect } from 'react';

import { useInitialize } from './common/hooks';
import { InitializationFailed, AppLayout } from './components';

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
