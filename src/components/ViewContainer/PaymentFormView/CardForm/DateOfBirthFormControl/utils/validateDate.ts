import { parse, isValid, isAfter, subYears, isBefore } from 'date-fns';

const parseDate = (value: string): { date: Date; day: number; month: number; year: number } | null => {
    try {
        // Parse date from "yyyy-MM-dd" format
        const date = parse(value, 'yyyy-MM-dd', new Date());

        if (!isValid(date)) {
            return null;
        }

        return {
            date,
            day: date.getDate(),
            month: date.getMonth() + 1, // date-fns uses 0-based months
            year: date.getFullYear(),
        };
    } catch {
        return null;
    }
};
const isValidDateRange = (date: Date): boolean => {
    const minDate = new Date(1900, 0, 1);
    const today = new Date();

    return isAfter(date, minDate) && isBefore(date, today);
};

const isOver18 = (birthDate: Date): boolean => {
    const today = new Date();
    const eighteenYearsAgo = subYears(today, 18);

    return isBefore(birthDate, eighteenYearsAgo);
};

export const validateDate = (value: string): true | string => {
    if (!value) return 'Date is required';

    const parsedDate = parseDate(value);
    if (!parsedDate) return 'Please enter a valid date';

    const { date } = parsedDate;

    if (!isValidDateRange(date)) {
        return 'Please enter a valid date between 1900 and today';
    }

    if (!isOver18(date)) {
        return 'You must be 18 or older';
    }

    return true;
};
