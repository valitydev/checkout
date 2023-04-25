import * as React from 'react';
import { useContext } from 'react';

import { NumerableList, ListItem } from '../numerable-list';
import { InitialContext } from '../../../../initial-context';

export const MobileCommerceReceiptForm = () => {
    const { locale } = useContext(InitialContext);
    return (
        <NumerableList>
            <ListItem number={1}>{locale['info.modal.mobile.commerce.description.steps'][0]}</ListItem>
            <ListItem number={2}>{locale['info.modal.mobile.commerce.description.steps'][1]}</ListItem>
        </NumerableList>
    );
};
