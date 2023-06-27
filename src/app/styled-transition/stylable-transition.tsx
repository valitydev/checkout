import * as React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';

type Props = Omit<
    React.ComponentProps<typeof CSSTransitionGroup>,
    | 'transitionName'
    | 'transitionAppear'
    | 'transitionAppearTimeout'
    | 'transitionEnter'
    | 'transitionEnterTimeout'
    | 'transitionLeave'
    | 'transitionLeaveTimeout'
> & {
    enter?: number | boolean;
    appear?: number | boolean;
    leave?: number | boolean;
    timeout?: number;
};

export const stylableTransition: React.FC<Props> = ({ enter, appear, leave, timeout, ...props }) => (
    <CSSTransitionGroup
        {...props}
        transitionName={props.className.split(' ')[1]}
        transitionAppear={appear === true || typeof appear === 'number'}
        transitionAppearTimeout={typeof appear === 'number' ? appear : timeout}
        transitionEnter={enter === true || typeof enter === 'number'}
        transitionEnterTimeout={typeof enter === 'number' ? enter : timeout}
        transitionLeave={leave === true || typeof leave === 'number'}
        transitionLeaveTimeout={typeof leave === 'number' ? leave : timeout}
    />
);
