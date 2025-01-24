import { parse, format } from 'date-fns';

export const formatDateToDashFormat = (dateString: string): string => {
    try {
        const date = parse(dateString, 'dd / MM / yyyy', new Date());
        return format(date, 'yyyy-MM-dd');
    } catch {
        return dateString; // Return original string if parsing fails
    }
};
