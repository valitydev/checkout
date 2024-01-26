type LocalePath = string;
type ViewAmount = string;

type MetadataForm = {
    name: 'MetadataForm';
} & CommonForm;

type CardForm = {
    name: 'CardForm';
} & CommonForm;

type CommonForm = {
    viewAmount: ViewAmount;
    formTitle: LocalePath;
};

export type PaymentFormViewModel = CardForm | MetadataForm;

export type CommonSubmitFormValues = {
    email?: string;
    phoneNumber?: string;
};

export type CardFormInputs = {
    cardNumber: string;
    secureCode: string;
    expireDate?: string;
    cardHolder?: string;
} & CommonSubmitFormValues;

export type CardFormSubmitFormValues = {
    formName: 'CardForm';
    values: CardFormInputs;
};

export type SubmitFormValues = CardFormSubmitFormValues;
