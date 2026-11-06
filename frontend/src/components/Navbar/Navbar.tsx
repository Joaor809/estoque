import "./Navbar.css";

interface button {
    name: string;
    link: string;
}

type NavbarProps = {
    btn: button[],
    srcLogo: string;
}

function Navbar({ btn, srcLogo }: NavbarProps) {
    return (
        <nav className="navbar">
            <a href="/">
                <img className="logo" src={srcLogo} alt="Logo" />
            </a>

            <div className="nav-links">
                {btn.map((item, index) => (
                    <a className="btn-link" key={index} href={item.link}>
                        {item.name}
                    </a>
                ))}
            </div>
        </nav>
    )
}

export default Navbar;