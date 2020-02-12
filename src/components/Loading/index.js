import React from 'react';
import styled from 'styled-components';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

const StyledBlockUi = styled(BlockUi)`
    min-height: 100px
`;

const Loading = ({isLoading, loadingMsg, ...props}) => {
    const renderProps = {
        tag: 'div',
        blocking: isLoading || false,
        message: loadingMsg || 'Loading, please waiting...',
        renderChildren: false
    };
    
    return <StyledBlockUi {...renderProps} {...props} />
}

export default Loading;