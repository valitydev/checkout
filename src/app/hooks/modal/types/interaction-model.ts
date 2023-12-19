import { PaymentToolDetails, UserInteraction } from 'checkout/backend';

export type InteractionModel = {
    userInteraction: UserInteraction;
    paymentToolDetails: PaymentToolDetails;
    paymentID: string;
};
