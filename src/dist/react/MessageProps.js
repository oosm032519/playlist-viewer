import React from 'react';
const Message = ({ text, type }) => {
    const messageStyle = type === 'success' ? 'text-green-500' : 'text-red-500';
    return (React.createElement("div", { className: `message ${messageStyle}` }, text));
};
export default Message;
//# sourceMappingURL=MessageProps.js.map