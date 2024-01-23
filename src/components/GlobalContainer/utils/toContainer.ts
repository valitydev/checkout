import { PaymentModel } from '../../../common/paymentModel';
import { Container } from '../types';

export const toContainer = (model: PaymentModel): Container => {
    const containerMock: Container = { name: 'viewContainer' };
    console.log('toContainer: model -> container', model, containerMock);
    return containerMock;
};
