export type PayableInvoiceData = {
    invoice: {
        id: string;
        dueDate: string;
        externalID: string;
    };
    invoiceAccessToken: string;
};
