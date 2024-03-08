import React from 'react';
const MessageDisplay = ({ message, type }) => {
    const messageClass = type === 'success' ? 'text-green-500' : 'text-red-500';
    return (React.createElement("div", { className: `message-display ${messageClass}` }, message));
};
export default MessageDisplay;
//# sourceMappingURL=MessageDisplay.js.map
