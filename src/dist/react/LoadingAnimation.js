import React from 'react';
const LoadingAnimation = ({ isLoading }) => {
    if (!isLoading) {
        return null;
    }
    return (React.createElement("div", { className: "loader animate-spin h-12 w-12 border-t-4 border-green-500 rounded-full absolute top-0 bottom-0 left-0 right-0 m-auto" }));
};
export default LoadingAnimation;
//# sourceMappingURL=LoadingAnimation.js.map