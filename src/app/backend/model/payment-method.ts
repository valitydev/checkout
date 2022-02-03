export enum PaymentMethodName {
    BankCard = 'BankCard',
    PaymentTerminal = 'PaymentTerminal',
    DigitalWallet = 'DigitalWallet',
    MobileCommerce = 'MobileCommerce',
    OnlineBanking = 'OnlineBanking'
}

export abstract class PaymentMethod {
    method: PaymentMethodName;
}
