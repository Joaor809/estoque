import "./Input.css"

type inputProps = {
    type: string;
    placeholder?: string
}

function Input({ type, placeholder }: inputProps){
    return (
        <input type={type} placeholder={placeholder}/>
    )
}

export default Input;