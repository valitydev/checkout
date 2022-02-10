import { OnlineBankingPaymentMethod, PaymentMethod, PaymentMethodName } from 'checkout/state';
import { logUnavailableWithConfig } from './log-unavailable-with-config';
import { TerminalProviders } from 'checkout/backend';

const mapPaymentMethodNameByProvider: { [P in TerminalProviders]: PaymentMethodName } = {
    euroset: PaymentMethodName.Euroset,
    qps: PaymentMethodName.QPS,
    uzcard: PaymentMethodName.Uzcard
};

export const getTerminalsPaymentMethods = (
    methods: { [P in TerminalProviders | 'onlineBanking']?: boolean } = {},
    providers: TerminalProviders[],
    paymentFlowHold: boolean,
    recurring: boolean
): PaymentMethod[] => {
    if (paymentFlowHold) {
        logUnavailableWithConfig('terminals', 'paymentFlowHold');
        return [];
    }
    if (recurring) {
        logUnavailableWithConfig('terminals', 'recurring');
        return [];
    }
    return Object.values<PaymentMethod>(
        providers.reduce<{ [P in keyof typeof methods]?: PaymentMethod }>((acc, provider) => {
            // if (provider.includes(providers as any) && methods[provider]) { // TODO
            if (typeof provider === 'string' && provider.includes(providers as any) && methods[provider]) {
                acc[provider] = { name: mapPaymentMethodNameByProvider[provider] };
            } else if (methods.onlineBanking) {
                acc.onlineBanking = {
                    name: PaymentMethodName.OnlineBanking,
                    serviceProviders: [
                        ...((acc.onlineBanking as OnlineBankingPaymentMethod)?.serviceProviders || []),
                        provider
                    ]
                } as PaymentMethod;
            }
            return acc;
        }, {})
    );
};
