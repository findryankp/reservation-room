import { InputHTMLAttributes } from "react";

interface TextAreaProps {
    label: string;
    name: string;
    type?: string;
    value: string;
    placeholder: string
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
}

const TextArea: React.FC<TextAreaProps> = ({
    label,
    name,
    type,
    value,
    onChange,
    placeholder
}) => {
    return (
        <div className="mb-1">
            <label className="block font-light mb-2" htmlFor={name}>
                {label}
            </label>
            <textarea
                className="textarea textarea-primary bg-primary w-full max-w-xs"
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    )
}

export default TextArea;