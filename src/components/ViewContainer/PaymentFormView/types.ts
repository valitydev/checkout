export type CardFormInputs = {
    cardNumber: string;
    expireDate: string;
    secureCode: string;
    cardHolder: string;
    amount: string;
};

type LocalePath = string;
type ViewAmount = string;

type MetadataForm = {
    name: 'metadataForm';
    formData?: any;
} & CommonForm;

type CardForm = {
    name: 'cardForm';
    formData?: CardFormInputs;
} & CommonForm;

type CommonForm = {
    viewAmount: ViewAmount;
    formTitle: LocalePath;
};

export type PaymentFormViewModel = CardForm | MetadataForm;
