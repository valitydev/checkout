import * as React from 'react';
import { Input, Item, List } from 'checkout/components';
import SearchIcon from './search.svg';
import { FormGroup } from 'checkout/components/app/modal-container/modal/form-container/form-group';
import { connect } from 'react-redux';
import { State } from 'checkout/state';
import { ComponentProps, ReactElement, useEffect, useState } from 'react';

export interface Params {
    idx: number;
}

interface Props<T> {
    values: T[];
    filter: (search: string, value: T, params: Params) => boolean;
    item: (value: T, params: Params) => ComponentProps<typeof Item>;
    select?: (value: T, params: Params) => void;
    search?: (search: string) => void;
}

const mapState = (state: State) => ({
    locale: state.config.locale
});

const FilteredListRef = <T extends any>(props: Props<T> & ReturnType<typeof mapState>) => {
    const [search, setSearch] = useState('');
    const filteredValues = props.values
        .map((value, idx) => [value, { idx }] as const)
        .filter(([value, params]) => props.filter(search, value, params));

    useEffect(() => {
        props.search(search);
    }, [search]);

    return (
        <div>
            <FormGroup>
                <Input
                    placeholder={props.locale['form.payment.method.name.onlineBanking.search']}
                    icon={<SearchIcon />}
                    onInput={({ currentTarget }) => setSearch(currentTarget.value)}
                />
            </FormGroup>
            {!!filteredValues.length && (
                <List>
                    {filteredValues.map(([value, params]) => (
                        <Item
                            {...props.item(value, params)}
                            onClick={props.select ? () => props.select(props.values[params.idx], params) : null}
                            key={params.idx}
                        />
                    ))}
                </List>
            )}
        </div>
    );
};

export const FilteredList: <T>(props: Props<T>) => ReactElement = connect(mapState)(FilteredListRef);
