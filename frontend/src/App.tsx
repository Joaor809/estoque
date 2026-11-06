import Navbar from "./components/Navbar/Navbar";
import CardCart from "./components/CardCart/CardCart";
import Input from "./components/Input/Input";

function App() {
  return (
    <div>

      <Navbar srcLogo="../public/logo.png" btn={[
        { name: "Produtos", link: "/product" },
        { name: "Vendas", link: "/sell" }
      ]} />
      <br /><br /><br />

      <CardCart imgProduct="https://img.cdndsgni.com/preview/10001796.jpg" nameProduct="Arroz 5Kg" quantity={3} value={60}/>

      <br /><br /><br />

      <Input type="text"/>
    </div>
  )
}

export default App
