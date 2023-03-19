import React from 'react'

interface ButtonProps{
    size?: string
    color?: string
    onClick?: React.MouseEventHandler
    children?: React.ReactNode
    type?: any
}

const Button: React.FC<ButtonProps> = ({size, color, onClick, children, type}) => {
    return (
        <button type={type} className={`btn ${size} ${color} text-primary font-bold cursor-pointer sm:font-bold`}
            onClick={onClick}
        >{children}</button>
    )
}
export default Button