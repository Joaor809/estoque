import Button from "../Button/Button";
import "./Modal.css";

type ModalProps = {
    title: string;
    message: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function Modal({ title, message, isOpen, onClose }: ModalProps) {
    
    if (!isOpen) return null;

    return (
        <div className="modal">
            <h2>{title}</h2>
            <p>{message}</p>
            <div className="btn-close">
                <Button nameButton="Fechar" onClick={onClose}/>
            </div>
        </div>
    );
}