import React from 'react';

type LoadingAnimationProps = {
    isLoading: boolean;
};

const LoadingAnimation: React.FC<LoadingAnimationProps> = ({isLoading}) => {
    if (!isLoading) {
        return null;
    }
    
    return (
        <div
            className="loader animate-spin h-12 w-12 border-t-4 border-green-500 rounded-full absolute top-0 bottom-0 left-0 right-0 m-auto"></div>
    );
};

export default LoadingAnimation;
