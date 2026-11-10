import { BrowserRouter, Routes, Route } from "react-router-dom"
import Seller from "./pages/Seller/Seller"
import Sales from "./pages/Seller/Sales/Sales";
import Sell from "./pages/Seller/Sell/Sell";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/seller" element={<Seller/>} />
        <Route path="/seller/sell/" element={<Sell/>} />
        <Route path="/seller/sales/" element={<Sales/>} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
