import "./Button.css";

type buttonProps = {
    nameButton: string;
    typeButton?: "button" | "submit" | "reset";
    onClick?: () => void;
}

function Button({ nameButton, typeButton = "button", onClick }: buttonProps) {
    return (
        <button type={typeButton} className="btn" onClick={onClick}>
            {nameButton}
        </button>
    )
}

export default Button;