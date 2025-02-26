export const validateStringValue =
    (maxLength: number = 100) =>
    (value: unknown): true | string => {
        if (typeof value !== 'string') return 'Must be a string';
        if (value.trim().length === 0) return 'Cannot be empty';
        if (value.trim().length > maxLength) return `Cannot be longer than ${maxLength} characters`;
        return true;
    };
