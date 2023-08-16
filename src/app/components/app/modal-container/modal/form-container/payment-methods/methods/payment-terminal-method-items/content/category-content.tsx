import * as React from 'react';

import { KnownProviderCategories } from 'checkout/hooks';

export const CategoryContent: React.FC<{
    category: KnownProviderCategories;
}> = ({ category }) => {
    switch (category) {
        case 'netbanking':
            return <img height="68px" src="/assets/inb-logo.jpg" width="106px"></img>;
    }
    return <div>{category}</div>;
};
