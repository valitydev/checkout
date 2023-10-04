export type ErrorDetails = {
    code: string;
    message: string;
};

export type ResponseError = {
    status: number;
    statusText?: string;
    details?: ErrorDetails;
};
