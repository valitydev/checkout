import { useEffect } from 'react';

import { CompletePaymentContext } from './common/contexts';
import { isNil } from './common/utils';
import { CommunicatorEvents } from './communicator';
import { InitializationFailed, AppLayout } from './components';
import { useInitialize } from './useInitialize';

const ON_COMPLETE_TIMEOUT_MS = 1000 * 5;

export function App() {
    const { state, init } = useInitialize();

    useEffect(() => {
        init();
    }, []);

    return (
        <>
            {state.status === 'SUCCESS' && (
                <CompletePaymentContext.Provider
                    value={{
                        onComplete: () =>
                            setTimeout(() => {
                                const [transport, params] = state.data;
                                transport.emit(CommunicatorEvents.finished);
                                transport.destroy();
                                const redirectUrl = params.initConfig?.redirectUrl;
                                if (!isNil(redirectUrl)) {
                                    window.open(redirectUrl, '_self');
                                }
                            }, ON_COMPLETE_TIMEOUT_MS),
                    }}
                >
                    <AppLayout initParams={state.data[1]} />
                </CompletePaymentContext.Provider>
            )}
            {state.status === 'FAILURE' && <InitializationFailed error={state.error} />}
        </>
    );
}
