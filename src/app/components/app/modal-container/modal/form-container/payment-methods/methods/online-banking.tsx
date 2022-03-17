import * as React from 'react';

import { Method } from './method';
import { Title } from './title';
import { Text } from './text';
import { Icon } from './icon/icon';
import { FormInfo, FormName, KnownProviderCategories, OnlineBankingFormInfo } from 'checkout/state';
import { Locale } from 'checkout/locale';

interface OnlineBankingProps {
    category: KnownProviderCategories;
    locale: Locale;
    setFormInfo: (formInfo: FormInfo) => any;
}

const toOnlineBanking = (props: OnlineBankingProps) =>
    props.setFormInfo(new OnlineBankingFormInfo(props.category, FormName.paymentMethods));

const getTitle = (l: Locale, category: KnownProviderCategories) => l[`form.payment.method.name.${category}.label`];

export const OnlineBanking: React.FC<OnlineBankingProps> = (props) => (
    <Method onClick={toOnlineBanking.bind(null, props)}>
        <Icon name="online-banking" />
        <Text>
            <Title>{getTitle(props.locale, props.category)}</Title>
        </Text>
    </Method>
);
