import * as React from 'react';

import { FormInfo, FormName } from 'checkout/state';
import { Locale } from 'checkout/locale';
import { Methods } from './methods';
import { AppContext, PaymentRequestedPayload } from 'checkout/actions';
import styled from 'checkout/styled-components';
import { stylableTransition } from 'checkout/styled-transition';
import { PaymentMethod } from 'checkout/hooks';

const List = styled(stylableTransition)`
    margin: 0;
    padding: 0;
    list-style: none;
    min-height: 266px;
`;

export interface MethodsProps {
    methods: PaymentMethod[];
    locale: Locale;
    setFormInfo: (formInfo: FormInfo) => any;
    pay: (payload: PaymentRequestedPayload) => any;
    amountPrefilled: boolean;
    emailPrefilled: boolean;
    phoneNumberPrefilled: boolean;
    prevFormName: FormName;
    localeCode: string;
    context: AppContext;
}

export const MethodsList: React.FC<MethodsProps> = ({ methods, ...props }) => (
    <List component="ul" appear={1000} leave={1000}>
        <Methods methods={methods} props={props} />
    </List>
);
