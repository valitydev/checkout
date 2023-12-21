export type Gateway = {
    id: string;
    name: string;
};

export type DestinationBankCard = {
    destinationType: 'BankCard';
    pan: string;
    bankName?: string;
};

export type DestinationSBP = {
    destinationType: 'SPB';
    phoneNumber: string;
    bankName?: string;
    recipientName?: string;
};

export type Destination = DestinationBankCard | DestinationSBP;
