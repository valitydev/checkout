import { CommonFormInputs } from '../types';

export type MetadataFormInputs = {
    provider: string;
    metadata?: any;
} & CommonFormInputs;
