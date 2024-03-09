import React, {useEffect, useState} from 'react';

type MessageDisplayProps = {
    message: string;
    type: 'success' | 'error';
};

const MessageDisplay: React.FC<MessageDisplayProps> = ({message, type}) => {
    const [isVisible, setIsVisible] = useState(true);
    const messageClass = type === 'success' ? 'bg-green-500 border-green-500' : 'bg-red-500 border-red-500';
    
    useEffect(() => {
        console.log('メッセージを表示します');
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, [message]);
    
    return (
        <div
            className={`message-display ${messageClass} text-lg font-bold border-2 p-2 fixed bottom-0 right-0 m-6 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'} shadow-md rounded-lg flex items-center justify-center text-2xl`}>
            {message}
        </div>
    );
};

export default MessageDisplay;
