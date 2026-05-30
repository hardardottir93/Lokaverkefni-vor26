import { createBrowserRouter } from "react-router-dom";

import { Layout } from "../components/Layout";
import { ProtectedRoute } from "../components/ProtectedRoutes";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { OrderConfirmationPage } from "../pages/OrderConfirmationPage";
import { ProductsPage } from "../pages/ProductsPage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { ProfilePage } from "../pages/ProfilePage";
import { RegisterPage } from "../pages/RegisterPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "products/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "checkout",
            element: <CheckoutPage />,
          },
          {
            path: "order-confirmation",
            element: <OrderConfirmationPage />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
]);
