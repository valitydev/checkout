const parseDate = (value: string) => {
    const cleanValue = value.replace(/\s/g, '');
    const [day, month, year] = cleanValue.split('/').map(Number);
    const date = new Date(year, month - 1, day);

    if (isNaN(date.getTime())) return null;

    return { date, day, month, year };
};

const isValidDateRange = (day: number, month: number, year: number): boolean => {
    return day <= 31 && month <= 12 && year >= 1900;
};

const isOver18 = (birthDate: Date): boolean => {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return birthDate <= minDate;
};

export const validateDate = (value: string): true | string => {
    if (!value) return 'Date is required';

    const parsedDate = parseDate(value);
    if (!parsedDate) return 'Please enter a valid date of birth (must be 18 or older)';

    const { date, day, month, year } = parsedDate;

    if (!isValidDateRange(day, month, year) || !isOver18(date)) {
        return 'Please enter a valid date of birth (must be 18 or older)';
    }

    return true;
};
