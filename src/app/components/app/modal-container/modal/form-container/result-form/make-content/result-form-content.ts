export enum ResultFormType {
    ERROR = 'error',
    WARNING = 'warning',
    SUCCESS = 'success',
}

export interface ResultFormContent {
    hasActions: boolean;
    hasDone: boolean;
    header: string;
    description?: string;
    type: ResultFormType;
}
