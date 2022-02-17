import * as React from 'react';
import { Item, List } from '../list';
import SearchIcon from './search.svg';
import { FormGroup } from 'checkout/components/app/modal-container/modal/form-container/form-group';
import { ComponentProps, useEffect, useState } from 'react';
import styled from 'checkout/styled-components';
import { Input } from 'checkout/components';

const StyledFilteredList = styled.div`
    overflow-y: auto;
    display: flex;
    flex-flow: column;
`;
const StyledList = styled(List)`
    margin-top: 10px;
`;

export interface Params {
    idx: number;
}

interface Props<T> {
    placeholder: string;
    values: T[];
    filter: (search: string, value: T, params: Params) => boolean;
    item: (value: T, params: Params) => ComponentProps<typeof Item>;
    select?: (value: T, params: Params) => void;
    search?: (search: string) => void;
}

export const FilteredList = <T extends any>({
    placeholder,
    values,
    filter,
    item,
    select,
    search: searchFn,
    ...props
}: Omit<JSX.IntrinsicElements['div'], 'ref'> & Props<T>) => {
    const [search, setSearch] = useState('');
    const filteredValues = values
        .map((value, idx) => [value, { idx }] as const)
        .filter(([value, params]) => filter(search, value, params));

    useEffect(() => {
        searchFn(search);
    }, [search]);

    return (
        <StyledFilteredList {...props}>
            <FormGroup>
                <Input
                    placeholder={placeholder}
                    icon={<SearchIcon />}
                    onInput={({ currentTarget }) => setSearch(currentTarget.value)}
                />
            </FormGroup>
            {!!filteredValues.length && (
                <StyledList>
                    {filteredValues.map(([value, params]) => (
                        <Item
                            {...item(value, params)}
                            onClick={select ? () => select(values[params.idx], params) : null}
                            key={params.idx}
                        />
                    ))}
                </StyledList>
            )}
        </StyledFilteredList>
    );
};
