import { createBrowserRouter } from "react-router-dom";

import { Layout } from "../components/Layout";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { OrderConfirmationPage } from "../pages/OrderConfirmationPage";
import { ProductDetailsPage } from "../pages/ProductDetailsPage";
import { ProductsPage } from "../pages/ProductsPage";
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
        element: <ProductDetailsPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
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
        path: "order-confirmation",
        element: <OrderConfirmationPage />,
      },
    ],
  },
]);
