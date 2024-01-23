import { FieldError, UseFormRegister } from 'react-hook-form';

import { Locale } from 'checkout/locale';

import { formatCardHolder } from './formatCardHolder';
import { validateCardHolder } from './validateCardHolder';
import { ReactComponent as UserIcon } from '../../../../../app/components/ui/icon/user.svg';
import { isNil } from '../../../../../common/utils';
import { Input } from '../../../../legacy';
import { CardFormInputs } from '../CardForm';

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
