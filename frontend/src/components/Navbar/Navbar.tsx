import "./Navbar.css";

interface button {
    name: string;
    link: string;
}

type NavbarProps = {
    btn: button[],
}

function Navbar({ btn }: NavbarProps) {
    return (
        <nav className="navbar">
            <a href="/">
                <img className="logo" src="./../../../public/logo.png" alt="Logo" />
            </a>

            <div className="nav-links">
                {btn.map((item, index) => (
                    <a className="btn-link" key={index} href={item.link}>
                        {item.name}
                    </a>
                ))}
                <a className="btn-link">Sair</a>
            </div>
        </nav>
    )
}

export default Navbar;