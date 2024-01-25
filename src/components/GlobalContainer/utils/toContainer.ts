import { PaymentCondition } from '../../../common/paymentCondition';
import { Container } from '../types';

export const toContainer = (paymentCondition: PaymentCondition): Container => {
    switch (paymentCondition.name) {
        case 'uninitialized':
        case 'processed':
            return { name: 'ViewContainer' };
    }
};
