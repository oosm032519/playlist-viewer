import React, {ReactNode, MouseEventHandler} from 'react';

type ButtonProps = {
    children: ReactNode;
    onClick: MouseEventHandler;
    className: string;
};

export const Button = ({children, onClick, className}: ButtonProps) => (
    <button onClick={onClick} className={className}>
        {children}
    </button>
);
