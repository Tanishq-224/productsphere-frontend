import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login/Login";
import Signup from "../pages/Auth/Signup/Signup";
import ForgotPassword from "../pages/Auth/ForgotPassword/ForgotPassword";
import Profile from "../pages/Profile/Profile";

import Products from "../pages/Products/Products";
import ProductDetail from "../pages/ProductDetail/ProductDetail";
import ProductCreate from "../pages/ProductCreate/ProductCreate";
import ProductEdit from "../pages/ProductEdit/ProductEdit";

import Contact from "../pages/Contact/Contact";
import About from "../pages/About/About";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>

          {/* =========================
              PUBLIC ROUTES
          ========================= */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/auth/login"
            element={<Login />}
          />

          <Route
            path="/auth/signup"
            element={<Signup />}
          />

          <Route
            path="/auth/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          {/* =========================
              PROFILE - PROTECTED
          ========================= */}

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* =========================
              PRODUCTS - PUBLIC
          ========================= */}

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/products/:slug"
            element={<ProductDetail />}
          />

          {/* =========================
              PRODUCTS - PROTECTED
          ========================= */}

          <Route
            path="/products/create"
            element={
              <ProtectedRoute>
                <ProductCreate />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/:slug/edit"
            element={
              <ProtectedRoute>
                <ProductEdit />
              </ProtectedRoute>
            }
          />

        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default AppRoutes;