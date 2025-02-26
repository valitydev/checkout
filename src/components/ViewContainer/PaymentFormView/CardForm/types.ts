export type CardFormInputs = {
    cardNumber: string;
    secureCode: string;
    expireDate?: string;
    cardHolder?: string;
    contactInfo: {
        dateOfBirth?: string;
        documentId?: string;
        firstName?: string;
        lastName?: string;
    };
};
