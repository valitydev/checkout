import { FormControl, InputGroup, InputLeftElement, Square, Input } from '@chakra-ui/react';
import { useContext } from 'react';
import { FormState, UseFormRegister } from 'react-hook-form';
import { HiIdentification } from 'react-icons/hi';

import { StatusInputRightElement } from 'checkout/components';
import { LocaleContext } from 'checkout/contexts';
import { isNil } from 'checkout/utils';

import { CardFormInputs } from '../types';

const validateDocumentId = (value: unknown): true | string => {
    if (typeof value !== 'string') return 'Document Id must be a string';
    if (value.trim().length === 0) return 'Document Id cannot be empty';
    return true;
};

export type DocumentIdFormControlProps = {
    register: UseFormRegister<CardFormInputs>;
    formState: FormState<CardFormInputs>;
};

export function DocumentIdFormControl({ register, formState: { errors, dirtyFields } }: DocumentIdFormControlProps) {
    const { l } = useContext(LocaleContext);

    const inputRightElStatus =
        isNil(errors?.contactInfo?.documentId) && dirtyFields?.contactInfo?.documentId ? 'success' : 'unknown';

    return (
        <FormControl isInvalid={!isNil(errors?.contactInfo?.documentId)}>
            <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                    <Square as={HiIdentification} color="gray.400" />
                </InputLeftElement>
                <Input
                    {...register('contactInfo.documentId', {
                        required: true,
                        validate: validateDocumentId,
                    })}
                    autoComplete="off"
                    placeholder={l['form.input.documentId.placeholder']}
                />
                <StatusInputRightElement status={inputRightElStatus} />
            </InputGroup>
        </FormControl>
    );
}
