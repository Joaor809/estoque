import { BrowserRouter, Routes, Route } from "react-router-dom"
import Seller from "./pages/Seller/Seller"
import Sales from "./pages/Seller/Sales/Sales.tsx";
import Sell from "./pages/Seller/Sell/Sell";
import Products from "./pages/PagesPublics/Products/Products.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/seller" element={<Seller/>} />
        <Route path="/seller/sell/" element={<Sell/>} />
        <Route path="/seller/sales/" element={<Sales/>} />
        <Route path="/products" element={<Products/>} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
