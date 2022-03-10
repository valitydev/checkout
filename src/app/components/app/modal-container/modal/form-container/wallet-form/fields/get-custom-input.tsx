import * as React from 'react';
import { WrappedFieldProps } from 'redux-form';

import { isError } from 'checkout/utils';
import { Input } from '../../input';

export interface CustomInputProps {
    id: string;
    placeholder: string;
    type: React.HTMLInputTypeAttribute;
    onInput?: React.FormEventHandler;
    autocomplete?: string;
}

export const getCustomInput = (props: CustomInputProps, fieldProps: WrappedFieldProps) => (
    <Input
        {...fieldProps.input}
        {...fieldProps.meta}
        error={isError(fieldProps.meta)}
        placeholder={props.placeholder}
        mark={true}
        type={props.type}
        id={props.id}
        onInput={props?.onInput}
        autocomplete={props?.autocomplete}
    />
);
