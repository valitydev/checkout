import { PaymentCondition } from '../../../common/paymentCondition';
import { Container } from '../types';

export const toContainer = (paymentCondition: PaymentCondition): Container => {
    switch (paymentCondition.name) {
        case 'uninitialized':
        case 'processed':
        case 'pending':
        case 'paymentFailed':
        case 'paymentProcessFailed':
            return { name: 'ViewContainer' };
        case 'interactionRequested':
            switch (paymentCondition.interaction.type) {
                case 'PaymentInteractionQRCode':
                case 'PaymentInteractionApiExtension':
                    return { name: 'ViewContainer' };
                case 'PaymentInteractionRedirect':
                    return { name: 'RedirectContainer' };
            }
    }
};
