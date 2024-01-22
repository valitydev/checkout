import { renderHook, waitFor, act } from '@testing-library/react';

import { useInitialize } from './useInitialize';
import { initialize } from '../../app/initialize';

jest.mock('../app/initialize', () => ({
    initialize: jest.fn(),
}));

const mockInitialize = initialize as jest.MockedFunction<typeof initialize>;

describe('useInitialize', () => {
    it('should start with a PRISTINE state', async () => {
        const { result } = renderHook(() => useInitialize());
        expect(result.current.state.status).toBe('PRISTINE');
    });

    it('handles successful initialization', async () => {
        const mockPayload = ['mockTransport', 'mockInitParams'];
        mockInitialize.mockResolvedValue(mockPayload as any);

        const { result } = renderHook(() => useInitialize());

        await act(async () => {
            result.current.init();
        });

        await waitFor(() => {
            expect(result.current.state.status).toBe('SUCCESS');
            if (result.current.state.status === 'SUCCESS') {
                expect(result.current.state.data).toEqual(mockPayload);
            }
        });
    });

    it('handles initialization failure', async () => {
        const mockError = new Error('Initialization failed');
        mockInitialize.mockRejectedValue(mockError);

        const { result } = renderHook(() => useInitialize());

        await act(async () => {
            result.current.init();
        });

        await waitFor(() => {
            expect(result.current.state.status).toBe('FAILURE');
            if (result.current.state.status === 'FAILURE') {
                expect(result.current.state.error).toEqual(mockError);
            }
        });
    });
});
