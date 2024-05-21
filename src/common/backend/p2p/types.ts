export type Gateway = {
    id: string;
    name: string;
};

export type DestinationBankCard = {
    destinationType: 'BankCard';
    pan: string;
    bankName?: string;
    recipientName?: string;
};

export type DestinationSBP = {
    destinationType: 'DestinationSBP';
    phoneNumber: string;
    bankName?: string;
    recipientName?: string;
};

export type DestinationBankAccount = {
    destinationType: 'BankAccount';
    account: string;
    bankName?: string;
    recipientName?: string;
    bic?: string;
    purpose?: string;
};

export type Destination = DestinationBankCard | DestinationSBP | DestinationBankAccount;
