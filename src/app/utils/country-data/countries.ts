// ISO 3166-1 alpha-2 code info

export interface CountrySubdivision {
    name: string;
    code: string;
}

export interface Country {
    name: string;
    code: string;
    sub: CountrySubdivision[];
}

export const countries: Country[] = [
    {
        name: 'India',
        code: 'IN',
        sub: [
            {
                name: 'Andhra Pradesh',
                code: 'AP',
            },
            {
                name: 'Arunāchal Pradesh',
                code: 'AR',
            },
            {
                name: 'Assam',
                code: 'AS',
            },
            {
                name: 'Bihār',
                code: 'BR',
            },
            {
                name: 'Chhattīsgarh',
                code: 'CT',
            },
            {
                name: 'Goa',
                code: 'GA',
            },
            {
                name: 'Gujarāt',
                code: 'GJ',
            },
            {
                name: 'Haryāna',
                code: 'HR',
            },
            {
                name: 'Himāchal Pradesh',
                code: 'HP',
            },
            {
                name: 'Jhārkhand',
                code: 'JH',
            },
            {
                name: 'Karnātaka',
                code: 'KA',
            },
            {
                name: 'Kerala',
                code: 'KL',
            },
            {
                name: 'Madhya Pradesh',
                code: 'MP',
            },
            {
                name: 'Mahārāshtra',
                code: 'MH',
            },
            {
                name: 'Manipur',
                code: 'MN',
            },
            {
                name: 'Meghālaya',
                code: 'ML',
            },
            {
                name: 'Mizoram',
                code: 'MZ',
            },
            {
                name: 'Nāgāland',
                code: 'NL',
            },

            {
                name: 'Odisha',
                code: 'OR',
            },
            {
                name: 'Punjab',
                code: 'PB',
            },
            {
                name: 'Rājasthān',
                code: 'RJ',
            },
            {
                name: 'Sikkim',
                code: 'SK',
            },
            {
                name: 'Tamil Nādu',
                code: 'TN',
            },

            {
                name: 'Telangāna',
                code: 'TG',
            },
            {
                name: 'Tripura',
                code: 'TR',
            },
            {
                name: 'Uttarākhand',
                code: 'UT',
            },
            {
                name: 'Uttar Pradesh',
                code: 'UP',
            },
            {
                name: 'West Bengal',
                code: 'WB',
            },
            {
                name: 'Andaman and Nicobar Islands',
                code: 'AN',
            },

            {
                name: 'Chandīgarh',
                code: 'CH',
            },
            {
                name: 'Dādra and Nagar Haveli and Damān and Diu',
                code: 'DH',
            },
            {
                name: 'Delhi',
                code: 'DL',
            },
            {
                name: 'Jammu and Kashmīr',
                code: 'JK',
            },
            {
                name: 'Ladākh',
                code: 'LA',
            },
            {
                name: 'Lakshadweep',
                code: 'LD',
            },
            {
                name: 'Puducherry',
                code: 'PY',
            },
        ],
    },
];
