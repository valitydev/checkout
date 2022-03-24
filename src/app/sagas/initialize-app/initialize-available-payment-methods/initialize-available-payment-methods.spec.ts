import { call, put, select } from 'redux-saga/effects';
import { initializeAvailablePaymentMethods } from './initialize-available-payment-methods';
import { IntegrationType } from 'checkout/config';
import { toAvailablePaymentMethods } from './to-available-payment-methods';
import { setPriority } from './set-priority';
import { TypeKeys } from 'checkout/actions';

describe('initializeAvailablePaymentMethods', () => {
    const paymentMethods = 'paymentMethodsMock' as any;

    describe('invoice integration', () => {
        const config = {
            initConfig: {
                integrationType: IntegrationType.invoice
            }
        } as any;

        const iterator = initializeAvailablePaymentMethods(config, paymentMethods, []);

        it('should call init', () => {
            const actual = iterator.next().value;
            const expected = call(initializeAvailablePaymentMethods, config, paymentMethods, []);
            expect(actual).toEqual(expected);
        });
    });

    describe('invoiceTemplate integration', () => {
        const config = {
            initConfig: {
                integrationType: IntegrationType.invoiceTemplate
            }
        } as any;

        const iterator = initializeAvailablePaymentMethods(config, paymentMethods, []);

        it('should call init', () => {
            const actual = iterator.next().value;
            const expected = call(initializeAvailablePaymentMethods, config, paymentMethods, []);
            expect(actual).toEqual(expected);
        });
    });
});

describe('init', () => {
    const config = 'config' as any;
    const paymentMethods = 'paymentMethodsMock' as any;
    const methods = 'methodsMock' as any;
    const prioritizedMethods = 'prioritizedMethodsMock' as any;
    const iterator = initializeAvailablePaymentMethods(config, paymentMethods, []);

    it('should call toAvailablePaymentMethods', () => {
        const actual = iterator.next().value;
        const expected = call(toAvailablePaymentMethods, paymentMethods, config, []);
        expect(actual).toEqual(expected);
    });

    it('should call setPriority', () => {
        const actual = iterator.next(methods).value;
        const expected = call(setPriority, methods);
        expect(actual).toEqual(expected);
    });

    it('should put prioritizedMethods', () => {
        const actual = iterator.next(prioritizedMethods).value;
        const expected = put({
            type: TypeKeys.INITIALIZE_AVAILABLE_PAYMENT_METHODS_COMPLETED,
            payload: prioritizedMethods
        });
        expect(actual).toEqual(expected);
    });

    it('should select availablePaymentMethods', () => {
        const actual = iterator.next().value;
        const expected = select();
        expect(actual.toString()).toEqual(expected.toString());
    });
});
