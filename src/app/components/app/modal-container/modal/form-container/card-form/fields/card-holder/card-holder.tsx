import { FieldError, UseFormRegister } from 'react-hook-form';

import { Input } from 'checkout/components';
import { Locale } from 'checkout/locale';
import isNil from 'checkout/utils/is-nil';

import { formatCardHolder } from './format-card-holder';
import { validateCardHolder } from './validate-card-holder';
import { ReactComponent as UserIcon } from '../../../../../../../ui/icon/user.svg';
import { CardFormInputs } from '../../card-form-inputs';

export type CardHolderProps = {
    register: UseFormRegister<CardFormInputs>;
    locale: Locale;
    fieldError: FieldError;
    isDirty: boolean;
};

export const CardHolder = ({ register, locale, fieldError, isDirty }: CardHolderProps) => (
    <Input
        {...register('cardHolder', {
            required: true,
            validate: (value) => !validateCardHolder(value) || 'Card holder is invalid',
        })}
        autoComplete="cc-name"
        dirty={isDirty}
        error={!isNil(fieldError)}
        icon={<UserIcon />}
        id="card-holder-input"
        mark={true}
        placeholder={locale['form.input.cardholder.placeholder']}
        spellCheck={false}
        onInput={formatCardHolder}
    />
);
