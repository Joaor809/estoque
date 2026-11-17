import { BrowserRouter, Routes, Route } from "react-router-dom"
import Seller from "./pages/Seller/Seller"
import Sales from "./pages/Seller/Sales/Sales.tsx";
import Sell from "./pages/Seller/Sell/Sell";
import ProductsSeller from "./pages/Seller/Products/Products.tsx";
import ProductsStockClerk from "./pages/Stock_Clerk/Products/Products.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/seller" element={<Seller/>} />
        <Route path="/seller/sell/" element={<Sell/>} />
        <Route path="/seller/sales/" element={<Sales/>} />
        <Route path="/seller/products" element={<ProductsSeller/>} />
        <Route path="/stock_clerk/products" element={<ProductsStockClerk/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;