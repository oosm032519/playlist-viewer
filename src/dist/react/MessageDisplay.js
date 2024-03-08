import React from 'react';
const MessageDisplay = ({ message, type }) => {
    const messageClass = type === 'success' ? 'bg-green-500 border-green-500' : 'bg-red-500 border-red-500';
    return (React.createElement("div", { className: `message-display ${messageClass} text-lg font-bold border-2 p-2 fixed bottom-0 right-0 m-6` }, message));
};
export default MessageDisplay;
//# sourceMappingURL=MessageDisplay.js.map