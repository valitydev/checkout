import * as React from 'react';
import { connect } from 'react-redux';

import { ResultState, State } from 'checkout/state';
import styled, { css } from 'checkout/styled-components';
import { device } from 'checkout/utils/device';
import { stylableTransition, APPEAR, LEAVE, ACTIVE } from 'checkout/styled-transition';
import { fadein, fadeout } from 'checkout/styled-components/animations';

const Animation = styled(stylableTransition)`
    ${APPEAR} {
        animation: ${fadein} 0.75s;
    }

    ${LEAVE} {
        animation: ${fadeout} 0.75s;

        ${ACTIVE} {
            opacity: 0;
        }
    }
`;

interface OverlayDefProps {
    inFrame: boolean;
    result: ResultState;
}

const OverlayBg = styled.div<{ inFrame: boolean }>`
    // Safari popup animation fix
    -webkit-transform: translateZ(-1000px);

    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    ${({ inFrame, theme }) => {
        if (!inFrame) {
            return css`
                @media ${device.desktop} {
                    background: rgba(0, 0, 0, 0.7);
                }
            `;
        }
        return css`
            background: ${theme.background.gradient};
        `;
    }}
`;

const OverlayDef: React.FC<OverlayDefProps> = ({ result, inFrame }) => (
    <Animation appear={750} leave={750}>
        {result !== ResultState.close && <OverlayBg inFrame={inFrame} key="overlay" />}
    </Animation>
);

const mapStateToProps = (state: State) => ({
    inFrame: state.config.inFrame,
    result: state.result
});

export const Overlay = connect(mapStateToProps)(OverlayDef);
