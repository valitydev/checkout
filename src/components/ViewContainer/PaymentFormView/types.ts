type ViewAmount = string;

type MetadataForm = {
    name: 'metadataForm';
    viewAmount: ViewAmount;
};

type CardForm = {
    name: 'cardForm';
    viewAmount: ViewAmount;
};

export type PaymentFormViewModel = CardForm | MetadataForm;
