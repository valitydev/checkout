import { PaymentCondition } from '../../../common/paymentCondition';
import { isNil, last } from '../../../common/utils';
import { ContainerName } from '../types';

export const toContainer = (conditions: PaymentCondition[]): ContainerName => {
    const condition = last(conditions);
    if (isNil(condition)) return 'ViewContainer';
    switch (condition.name) {
        case 'interactionRequested':
            switch (condition.interaction.type) {
                case 'PaymentInteractionQRCode':
                case 'PaymentInteractionApiExtension':
                    return 'ViewContainer';
                case 'PaymentInteractionRedirect':
                    return 'RedirectContainer';
            }
    }
    return 'ViewContainer';
};
