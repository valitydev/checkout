import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { device } from 'checkout/utils/device';

import { FormLoader } from '../legacy';

const Wrapper = styled.div`
    padding: 16px;

    @media ${device.desktop} {
        width: 360px;
        padding: 0;
    }
`;

const Layout = styled.div<{ height?: number }>`
    position: relative;
    background: #fff;
    border-radius: 16px;
    border: 1px solid ${({ theme }) => theme.form.border};
    padding: 16px;
    @media ${device.desktop} {
        padding: 24px;
    }
    overflow: hidden;
    transition: height 0.3s;
    height: ${({ height }) => (height ? `${height}px` : 'auto')};
`;

const DEFAULT_HEIGHT_PX = 300;

export function FormContainer() {
    const contentElement = useRef(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        setHeight(contentElement.current?.clientHeight || DEFAULT_HEIGHT_PX);
    }, []);

    return (
        <Wrapper>
            <Layout height={height}>
                <FormLoader />
            </Layout>
        </Wrapper>
    );
}
