import React, {ReactNode, MouseEventHandler} from 'react';

type ButtonProps = {
    children: ReactNode;
    onClick: MouseEventHandler;
};

export const Button = ({children, onClick}: ButtonProps) => (
    <button onClick={onClick}
            className="w-full bg-green-500 hover:bg-green-600 text-white hover:text-gray-900 rounded-lg h-10 p-3 mt-4 flex items-center justify-center transition-colors duration-300">
        {children}
    </button>
);
