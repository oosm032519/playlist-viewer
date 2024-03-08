import React from 'react';

type MessageDisplayProps = {
    message: string;
    type: 'success' | 'error';
};

const MessageDisplay: React.FC<MessageDisplayProps> = ({message, type}) => {
    const messageClass = type === 'success' ? 'bg-green-500 border-green-500' : 'bg-red-500 border-red-500';
    
    return (
        <div className={`message-display ${messageClass} text-lg font-bold border-2 p-2 fixed bottom-0 right-0 m-6`}>
            {message}
        </div>
    );
};

export default MessageDisplay;
