import React from 'react';
import {Triangle} from 'react-loader-spinner'

type LoadingAnimationProps = {
    isLoading: boolean;
};

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({isLoading}) => {
    if (!isLoading) {
        return null;
    }

    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
        }}>
            <Triangle
                visible={true}
                height="80"
                width="80"
                color="#2EBD59"
                ariaLabel="triangle-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    );
};

export default LoadingAnimation;
