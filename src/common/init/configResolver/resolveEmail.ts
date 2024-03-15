import { validateEmail } from '../../utils';

export const resolveEmail = (email: string | null): string | null => {
    return !validateEmail(email) ? email : null;
};
