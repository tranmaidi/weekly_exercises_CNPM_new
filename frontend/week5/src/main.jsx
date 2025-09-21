import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import RegisterPage from './pages/register.jsx';
import UserPage from './pages/user.jsx';
import HomePage from './pages/home.jsx';
import LoginPage from './pages/login.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ProductsPage from './pages/products.jsx';
import UserProducts from './pages/UserProducts.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Favorites from './pages/Favorites.jsx';
import ViewHistory from './pages/ViewHistory.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthWrapper>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<UserProducts />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="view-history" element={<ViewHistory />} />
            <Route path="admin/products" element={
              <ProtectedRoute>
                <ProductsPage />
              </ProtectedRoute>
            } />
            <Route path="admin/user" element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            } />
          </Route>
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </AuthWrapper>
  </React.StrictMode>,
)
