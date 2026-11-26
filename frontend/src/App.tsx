import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Seller from "./pages/Seller/Seller"
import Sales from "./pages/Seller/Sales/Sales.tsx";
import Sell from "./pages/Seller/Sell/Sell";
import ProductsSeller from "./pages/Seller/Products/Products.tsx";
import ProductsStockClerk from "./pages/Stock_Clerk/Products/Products.tsx";
import LotsStockClerk from "./pages/Stock_Clerk/Lots/Lots.tsx";
import SalesStockClerk from "./pages/Stock_Clerk/Sales/Sales.tsx";
import Login from "./pages/Login/Login.tsx";
import ProtectedRoute from "./routes/ProtectedRoute.tsx";
import Stock_Clerk from "./pages/Stock_Clerk/Stock_Clerk.tsx";
import GuestRoute from "./routes/GuestRoute.tsx";
import Admin from "./pages/Admin/Admin.tsx";
import ProductsAdmin from "./pages/Admin/Products/Products.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
          <Route path="/seller" element={<Seller />} />
          <Route path="/seller/sell/" element={<Sell />} />
          <Route path="/seller/sales/" element={<Sales />} />
          <Route path="/seller/products" element={<ProductsSeller />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["stock_clerk"]} />}>
          <Route path="/stock_clerk" element={<Stock_Clerk />} />
          <Route path="/stock_clerk/products" element={<ProductsStockClerk />} />
          <Route path="/stock_clerk/lots" element={<LotsStockClerk />} />
          <Route path="/stock_clerk/sales" element={<SalesStockClerk />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']}/>}>
          <Route path="/admin" element={<Admin/>} />
          <Route path="/admin/products" element={<ProductsAdmin/>} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;