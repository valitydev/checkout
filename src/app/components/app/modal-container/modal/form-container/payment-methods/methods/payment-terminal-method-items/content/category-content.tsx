import * as React from 'react';

import { KnownProviderCategories } from 'checkout/state';

export const CategoryContent: React.FC<{ category: KnownProviderCategories }> = ({ category }) => {
    switch (category) {
        case 'netbanking':
            return <img src="/assets/inb-logo.jpg" height="68px" width="106px"></img>;
    }
    return <div>{category}</div>;
};
