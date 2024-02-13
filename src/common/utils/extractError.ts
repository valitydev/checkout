import { isNil } from './isNil';

export const extractError = (error) => {
    if (error instanceof Error) {
        return `${error.name}: ${error.message}`;
    } else {
        const errorMessage = error?.details?.message;
        return isNil(errorMessage) ? JSON.stringify(error) : errorMessage;
    }
};
