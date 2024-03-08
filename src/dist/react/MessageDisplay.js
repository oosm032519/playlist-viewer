import React, { useEffect, useState } from 'react';
const MessageDisplay = ({ message, type }) => {
    const [isVisible, setIsVisible] = useState(true);
    const messageClass = type === 'success' ? 'bg-green-500 border-green-500' : 'bg-red-500 border-red-500';
    useEffect(() => {
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, [message]);
    return (React.createElement("div", { className: `message-display ${messageClass} text-lg font-bold border-2 p-2 fixed bottom-0 right-0 m-6 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}` }, message));
};
export default MessageDisplay;
//# sourceMappingURL=MessageDisplay.js.map