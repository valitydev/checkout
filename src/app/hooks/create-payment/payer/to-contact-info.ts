import { replaceSpaces } from 'checkout/utils/replace-spaces';
import isNil from 'checkout/utils/is-nil';
import { InitConfig } from 'checkout/config';
import { PayableFormValues, PaymentTerminalFormValues } from 'checkout/state';
import { ContactInfo } from 'checkout/backend';

const getPhoneNumber = (formValues: PayableFormValues): string | undefined => {
    const metadata = (formValues as PaymentTerminalFormValues)?.metadata;
    let phoneNumber;
    if (!isNil(metadata) && !isNil(metadata?.phoneNumber)) {
        phoneNumber = metadata.phoneNumber;
    }
    if (!isNil(formValues.phoneNumber)) {
        phoneNumber = formValues.phoneNumber;
    }
    return isNil(phoneNumber) ? undefined : replaceSpaces(phoneNumber);
};

const getEmail = (formValues: PayableFormValues): string | undefined => {
    const metadata = (formValues as PaymentTerminalFormValues)?.metadata;
    let email;
    if (!isNil(metadata) && !isNil(metadata?.email)) {
        email = metadata.email;
    }
    if (!isNil(formValues.email)) {
        email = formValues.email;
    }
    return isNil(email) ? undefined : replaceSpaces(email);
};

export const toContactInfo = (initConfig: InitConfig, formValues: PayableFormValues): ContactInfo => ({
    email: initConfig.email || getEmail(formValues),
    phoneNumber: initConfig.phoneNumber || getPhoneNumber(formValues)
});
