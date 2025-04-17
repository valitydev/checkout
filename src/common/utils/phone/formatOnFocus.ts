export const formatOnFocus =
    (telOnFocusValue = '+') =>
    (value: string): string =>
        value === '' ? telOnFocusValue : value;
