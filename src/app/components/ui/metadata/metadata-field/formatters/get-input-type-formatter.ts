import { formatEmail, formatPhoneNumber } from 'checkout/utils';

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
