import { formatEmail, formatPhoneNumber } from '../../../../../common/utils';

export const getInputTypeFormatter = (type: JSX.IntrinsicElements['input']['type']) => {
    switch (type) {
        case 'email':
            return formatEmail;
        case 'tel':
            return formatPhoneNumber;
        default:
            return null;
    }
};
