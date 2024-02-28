import { extractError } from '../common/utils';

export type InitializationFailedProps = {
    error: unknown;
};

export function InitializationFailed({ error }: InitializationFailedProps) {
    console.error(`Application Initialization Failed: ${extractError(error)}`, error);
    return <p>Application Initialization Failed: Please check the console for more details.</p>;
}
