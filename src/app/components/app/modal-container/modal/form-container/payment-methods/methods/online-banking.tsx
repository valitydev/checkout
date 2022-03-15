import * as React from 'react';

import { Method } from './method';
import { Title } from './title';
import { Text } from './text';
import { Icon } from './icon/icon';
import { FormInfo, FormName, OnlineBankingFormInfo, OnlineBankingSubtype } from 'checkout/state';
import { Locale } from 'checkout/locale';

interface OnlineBankingProps {
    subtype: OnlineBankingSubtype;
    locale: Locale;
    setFormInfo: (formInfo: FormInfo) => any;
}

const toOnlineBanking = (props: OnlineBankingProps) =>
    props.setFormInfo(new OnlineBankingFormInfo(props.subtype, FormName.paymentMethods));

const getTitle = (l: Locale, subtype: OnlineBankingSubtype) => l[`form.payment.method.name.${subtype}.label`];

export const OnlineBanking: React.FC<OnlineBankingProps> = (props) => (
    <Method onClick={toOnlineBanking.bind(null, props)}>
        <Icon name="online-banking" />
        <Text>
            <Title>{getTitle(props.locale, props.subtype)}</Title>
        </Text>
    </Method>
);
