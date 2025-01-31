export type BusinessError = {
    errorMessage: string;
};

export type Gateway = {
    id: string;
    name: string;
};

export type DestinationBankCard = {
    destinationType: 'BankCard';
    pan: string;
    bankName?: string;
    recipientName?: string;
    notification?: string;
    receiptRequired?: boolean;
};

export type DestinationSBP = {
    destinationType: 'DestinationSBP' | 'SBP';
    phoneNumber: string;
    bankName?: string;
    recipientName?: string;
    notification?: string;
    receiptRequired?: boolean;
};

export type DestinationBankAccount = {
    destinationType: 'BankAccount';
    account: string;
    bankName?: string;
    recipientName?: string;
    bic?: string;
    purpose?: string;
    notification?: string;
    receiptRequired?: boolean;
};

export type DestinationQRCode = {
    destinationType: 'QRCode';
    qrCode: string;
    bankName?: string;
    recipientName?: string;
    notification?: string;
    receiptRequired?: boolean;
};

export type Destination = DestinationBankCard | DestinationSBP | DestinationBankAccount | DestinationQRCode;
