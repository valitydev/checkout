import { extractError, formatCard } from 'checkout/utils';

export const formatCardPan = async (pan: string): Promise<string> => {
    try {
        const { number } = await import('card-validator');
        return formatCard(pan, number(pan));
    } catch (error) {
        console.error(`Error loading the card-validator library ${extractError(error)}`);
        return pan;
    }
};
