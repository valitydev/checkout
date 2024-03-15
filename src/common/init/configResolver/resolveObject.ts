import { isString } from '../../utils';

const getObject = (inputObject: object | string): object => {
    if (!isString(inputObject)) {
        try {
            inputObject = JSON.stringify(inputObject);
        } catch (e) {
            return null;
        }
    }
    if (inputObject.trim()[0] === '{') {
        try {
            return JSON.parse(inputObject);
        } catch (e) {
            return null;
        }
    }
    return null;
};

export const resolveObject = (inputObject: object | string): object => {
    if (!inputObject) {
        return null;
    }
    return getObject(inputObject);
};
