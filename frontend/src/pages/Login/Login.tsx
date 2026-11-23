import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Button from "../../components/Button/Button";
import api from "../../services/api";
import { headerWithJson } from "../../services/headers";

function Login() {

    const navigate = useNavigate();

    const [userName, setUserName] = useState<string>("");
    const [password, setPassword] = useState<string>("")
    const [showPassword, setShowPassword] = useState<Boolean>(false);

    async function login(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const response = await fetch(`${api}/login`, {
            ...headerWithJson,
            method: "POST",
            body: JSON.stringify({
                userName: userName,
                password: password
            })
        });

        const data = await response.json();



        localStorage.setItem("token", data.token);
        localStorage.setItem("idRole", String(data.user.idRole));

        switch (Number(data.user.idRole)) {
            case 1:
                navigate("/admin");
                break;

            case 2:
                navigate("/seller");
                break;

            case 3:
                navigate("/stock_clerk");
                break;

            default:
                localStorage.removeItem("token");
                localStorage.removeItem("idRole");
                navigate("/unauthorized");
        }
    }

    return (
        <div className="login-container">
            <div className="card-login">
                <div className="info-card">
                    <i className="bi bi-boxes"></i>
                    <h1>Controle de Estoque e Vendas</h1>
                    <span>Gerencie seu estoque e suas vendas de forma simples, rápida e eficiente.</span>
                </div>
                <div className="form-login">
                    <i className="bi bi-box"></i>
                    <h2>Faça seu login</h2>
                    <p>Acesse o sistema para continuar</p>
                    <form onSubmit={login}>
                        <div className="form-group">
                            <input type="text"
                                value={userName}
                                onChange={(event) => setUserName(event.target.value)} placeholder="Usuário" />
                        </div>
                        <div className="form-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)} placeholder="Senha" />
                            <button
                                type="button"
                                className="button-password"
                                onClick={() => {
                                    setShowPassword(!showPassword);
                                }}>
                                {showPassword ? (
                                    <i className="bi bi-eye-slash"></i>
                                ) : (
                                    <i className="bi bi-eye"></i>
                                )}
                            </button>
                        </div>
                        <div className="button-register">
                            <Button nameButton="Entrar" typeButton="submit" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;