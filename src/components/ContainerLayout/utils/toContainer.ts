import { PaymentModel } from '../../../hooks';
import { Container } from '../types';

export const toContainer = (model: PaymentModel): Container => {
    const containerMock: Container = { name: 'unifiedContainer' };
    console.log('toContainer: model -> container', model, containerMock);
    return containerMock;
};
