import { BrowserRouter, Routes, Route } from "react-router-dom";

// components:
import HeaderComponent from "./component/HeaderComponent";
import FooterComponent from "./component/FooterComponent";

//user components:
import RoutesWithUserChatComponent from "./component/user/RoutesWithUserChatComponent";

// publicly available pages:
import HomePage from "./page/HomePage";
import ProductDetailsPage from "./page/ProductDetailsPage";
import ProductListPage from "./page/ProductListPage";
import CartPage from "./page/CartPage";
import LoginPage from "./page/LoginPage";
import RegisterPage from "./page/RegisterPage";

import ProtectedRoutesComponent from "./component/ProtectedRoutesComponent";

// protected user pages:
import UserProfilePage from "./page/user/UserProfilePage";
import UserOrdersPage from "./page/user/UserOrdersPage";
import UserCartDetailsPage from "./page/user/UserCartDetailsPage";
import UserOrderDetailsPage from "./page/user/UserOrderDetailsPage";

// protected admin pages:
import AdminUsersPage from "./page/admin/AdminUsersPage";
import AdminEditUserPage from "./page/admin/AdminEditUserPage";
import AdminProductsPage from "./page/admin/AdminProductsPage";
import AdminCreateProductPage from "./page/admin/AdminCreateProductPage";
import AdminEditProductPage from "./page/admin/AdminEditProductPage";
import AdminOrdersPage from "./page/admin/AdminOrdersPage";
import AdminOrderDetailsPage from "./page/admin/AdminOrderDetailsPage";
import AdminChatsPage from "./page/admin/AdminChatsPage";
import AdminAnalyticsPage from "./page/admin/AdminAnalyticsPage";
import ScrollToTop from "./utils/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <HeaderComponent />
      <Routes>
        <Route element={<RoutesWithUserChatComponent />}>
          {/* publicly available routes: */}
          <Route path="/" element={<HomePage />} />
          <Route path="/product-list" element={<ProductListPage />} />
          <Route
            path="/product-list/:pageNumParam"
            element={<ProductListPage />}
          />
          <Route
            path="/product-list/category/:categoryName"
            element={<ProductListPage />}
          />
          <Route
            path="/product-list/category/:categoryName/:pageNumParam"
            element={<ProductListPage />}
          />
          <Route
            path="/product-list/search/:searchQuery"
            element={<ProductListPage />}
          />
          <Route
            path="/product-list/search/:searchQuery/:pageNumParam"
            element={<ProductListPage />}
          />
          <Route
            path="/product-list/category/:categoryName/search/:searchQuery"
            element={<ProductListPage />}
          />
          <Route
            path="/product-list/category/:categoryName/search/:searchQuery/:pageNumParam"
            element={<ProductListPage />}
          />
          <Route path="/product-details/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element="Page not exists 404" />
        </Route>
        {/* <Route path="/" component={HomePage} />  in previous versions of react-router-dom */}

        {/* user protected routes: */}
        <Route element={<ProtectedRoutesComponent admin={false} />}>
          <Route path="/user" element={<UserProfilePage />} />
          <Route path="/user/my-orders" element={<UserOrdersPage />} />
          <Route path="/user/cart-details" element={<UserCartDetailsPage />} />
          <Route
            path="/user/order-details/:id"
            element={<UserOrderDetailsPage />}
          />
        </Route>

        {/* admin protected routes: */}
        <Route element={<ProtectedRoutesComponent admin={true} />}>
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/edit-user/:id" element={<AdminEditUserPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route
            path="/admin/create-new-product"
            element={<AdminCreateProductPage />}
          />
          <Route
            path="/admin/edit-product/:id"
            element={<AdminEditProductPage />}
          />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route
            path="/admin/order-details/:id"
            element={<AdminOrderDetailsPage />}
          />
          <Route path="/admin/chats" element={<AdminChatsPage />} />
          <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
        </Route>
      </Routes>
      <FooterComponent />
    </BrowserRouter>
  );
}

export default App;
