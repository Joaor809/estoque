import "./Input.css"

type inputProps = {
    type: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
}

function Input({ type, placeholder, value, onChange }: inputProps){
    return (
        <input type={type} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)}/>
    )
}

export default Input;