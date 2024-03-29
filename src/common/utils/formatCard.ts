type CreditCardType = {
    gaps: number[];
    lengths: number[];
};

export type CardNumberVerification = {
    card: CreditCardType | null;
};

export const formatCard = (originalPan: string, { card }: CardNumberVerification): string => {
    let pan = originalPan.replace(/\D/g, ''); // Removes non-digit characters
    if (!card) {
        return pan;
    }

    const upperLength = card.lengths[card.lengths.length - 1];
    pan = pan.slice(0, upperLength);

    const gaps = [...card.gaps].reverse();
    for (const gap of gaps) {
        if (gap < pan.length) {
            // Ensure the gap index is within bounds
            pan = `${pan.slice(0, gap)} ${pan.slice(gap)}`;
        }
    }
    return pan.trim();
};
