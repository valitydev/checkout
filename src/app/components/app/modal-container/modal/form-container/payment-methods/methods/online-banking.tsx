import * as React from 'react';

import { MethodProps } from './method-props';
import { Method } from './method';
import { Title } from './title';
import { Text } from './text';
import { Icon } from './icon/icon';
import { OnlineBankingFormInfo } from 'checkout/state';

const toOnlineBanking = (props: MethodProps) => props.setFormInfo(new OnlineBankingFormInfo(props.prevFormName));

export const OnlineBanking: React.FC<MethodProps> = (props) => (
    <Method onClick={toOnlineBanking.bind(null, props)}>
        <Icon name="online-banking" />
        <Text>
            <Title>{props.locale['form.payment.method.name.onlineBanking.label']}</Title>
        </Text>
    </Method>
);
