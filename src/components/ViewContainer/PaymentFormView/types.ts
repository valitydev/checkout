type LocalePath = string;
type ViewAmount = string;

export type MetadataFormModel = {
    name: 'MetadataForm';
    provider: string;
} & CommonFormModel;

export type CardFormModel = {
    name: 'CardForm';
    formTitle: LocalePath;
} & CommonFormModel;

type CommonFormModel = {
    viewAmount: ViewAmount;
};

export type PaymentFormModel = CardFormModel | MetadataFormModel;

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

export type MetadataFormInputs = {
    provider: string;
    metadata?: any;
} & CommonSubmitFormValues;

export type CardFormSubmitFormValues = {
    formName: 'CardForm';
    values: CardFormInputs;
};

export type MetadataFormSubmitFormValues = {
    formName: 'MetadataForm';
    values: MetadataFormInputs;
};

export type SubmitFormValues = CardFormSubmitFormValues | MetadataFormSubmitFormValues;
