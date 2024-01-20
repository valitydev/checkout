import { useEffect } from 'react';

import { InitializationFailed } from './components';
import { useInitialize } from './hooks';

export function App() {
    const { state, init } = useInitialize();

    useEffect(() => {
        init();
    }, []);

    return (
        <>
            {state.status === 'SUCCESS' && <div>Success</div>}
            {state.status === 'FAILURE' && <InitializationFailed error={state.error} />}
        </>
    );
}
