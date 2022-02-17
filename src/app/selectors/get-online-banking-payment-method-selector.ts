import { OnlineBankingPaymentMethod, PaymentMethodName, State } from 'checkout/state';

export const getOnlineBankingPaymentMethodSelector = (state: State) =>
    state.availablePaymentMethods.find((m) => m.name === PaymentMethodName.OnlineBanking) as OnlineBankingPaymentMethod;
