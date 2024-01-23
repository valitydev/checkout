export type CardFormInputs = {
    cardNumber: string;
    expireDate: string;
    secureCode: string;
    cardHolder: string;
    amount: string;
};

type ViewAmount = string;

type MetadataForm = {
    name: 'metadataForm';
    viewAmount: ViewAmount;
    formData?: any;
};

type CardForm = {
    name: 'cardForm';
    viewAmount: ViewAmount;
    formData?: CardFormInputs;
};

export type PaymentFormViewModel = CardForm | MetadataForm;
