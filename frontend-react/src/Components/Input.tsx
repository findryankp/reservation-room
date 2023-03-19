import { InputHTMLAttributes } from "react";

interface InputProps {
    label: string;
    name: string;
    type?: string;
    value?: string;
    placeholder: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    classes?: string;
}

const Input: React.FC<InputProps> = ({
    label,
    name,
    type,
    value,
    onChange,
    placeholder,
    classes,
}) => {
    return (
        <div className="mb-1">
            <label className="block font-light mb-2" htmlFor={name}>
                {label}
            </label>
            <input
                className={`${classes || 'input input-primary'} 
                bg-primary w-full max-w-xs`}
                id={name}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    )
}

export default Input;