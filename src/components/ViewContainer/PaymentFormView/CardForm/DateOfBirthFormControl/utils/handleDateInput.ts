const formatDateString = (numbers: string): string => {
    if (numbers.length < 2) return numbers;

    const parts = {
        day: numbers.slice(0, 2),
        month: numbers.slice(2, 4),
        year: numbers.slice(4, 8),
    };

    const day = parseInt(parts.day);
    if (day < 1 || day > 31) return numbers;

    let formattedDate = `${parts.day} / `;
    if (numbers.length < 4) return formattedDate + numbers.slice(2);

    const month = parseInt(parts.month);
    if (month < 1 || month > 12) return formattedDate + numbers.slice(2);

    formattedDate += `${parts.month} / `;
    return formattedDate + parts.year;
};

const formatDate = (value: string, isBackspace: boolean): string => {
    // Remove all non-digits first
    const numbers = value.replace(/\D/g, '');

    // If backspace was pressed and we're at a separator position, remove an extra character
    if (isBackspace) {
        const lastChar = value[value.length - 1];
        if (lastChar === '/' || lastChar === ' ') {
            return formatDateString(numbers.slice(0, -1));
        }
    }

    return formatDateString(numbers);
};

const isBackspaceEvent = (event: Event): boolean => {
    return event instanceof InputEvent && event.inputType === 'deleteContentBackward';
};

export const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const isBackspace = isBackspaceEvent(e.nativeEvent);
    e.target.value = formatDate(e.target.value, isBackspace);
};
