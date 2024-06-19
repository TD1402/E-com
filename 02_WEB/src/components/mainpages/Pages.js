import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Products from "./products/Products";
import DetailProduct from "./detailProduct/DetailProduct";
import Register from "./auth/Register";

import OrderHistory from "./history/OrderHistory";
import OrderDetails from "./history/OrderDetails";
import Cart from "./cart/Cart";
import NotFound from "./utils/not_found/NotFound";
import Categories from "./categories/Categories";
import CreateProduct from "./createProduct/CreateProduct";
import Type from "./type/Type";
import UserInfo from "./auth/UserInfo";
import Contact from "./contact/Contact";
import { GlobalState } from "../../GlobalState";
import { Home } from "./home/Home";
import Revenue from "./revenue/Revenue";
import Checkout from "./checkout/Checkout";
import Processed from "./processed/Processed";
import Comment from "./processed/Comment";
import Profile from "./auth/Profile";
import MyFeedback from "./myfeedback/MyFeedback";
import Loading from "./utils/loading/Loading";
import SuccessModal from "./checkout/success";

//services

//Adv
//login
import Login from "./auth/Login";
//newpage
///
import Header from "../Header/Header";
import { TopHeader } from "../top-header/TopHeader";
import Footer from "../footer/Footer";
//testchat
import TestChat from "./contact/TestChat";
import Dashboard from "./dashboard/dashboard";

import ProductManagement from "./productManagement/ProductManagement";

import SellHistory from "./history/SellHistory";

function Pages() {
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;

  return (
    <Routes>
      <Route path="header" element={<Header />} />
      <Route path="topheader" element={<TopHeader />} />
      <Route path="footer" element={<Footer />} />

      <Route path="" element={<Home />} />
      <Route path="comment/:id" element={<Comment />} />
      <Route path="products" element={<Products />} />
      <Route path="contact" element={<Contact />} />
      <Route path="testchat" element={<TestChat />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="detail/:id" element={<DetailProduct />} />
      <Route path="success" element={<SuccessModal />} />

      <Route
        path="processed"
        element={isLogged ? <Processed /> : <Loading />}
      />

      <Route path="login" element={isLogged ? <Loading /> : <Login />} />
      <Route path="profile" element={isLogged ? <Profile /> : <Loading />} />
      <Route
        path="myfeedback"
        element={isLogged ? <MyFeedback /> : <Loading />}
      />
      <Route path="register" element={isLogged ? <Loading /> : <Register />} />
      <Route path="infor" element={isLogged ? <UserInfo /> : <Loading />} />

      <Route path="category" element={isAdmin ? <Categories /> : <Loading />} />
      <Route path="type" element={<Type />} />
      <Route
        path="create_product"
        element={isLogged ? <CreateProduct /> : <Navigate to="/login" />}
      />
      <Route
        path="product-management"
        element={isLogged ? <ProductManagement /> : <Loading />}
      />
      <Route
        path="edit_product/:id"
        element={isLogged ? <CreateProduct /> : <Loading />}
      />

      <Route
        path="history"
        element={isLogged ? <OrderHistory /> : <Loading />}
      />

      <Route
        path="sell-history/:id"
        element={isLogged ? <SellHistory /> : <Loading />}
      />

      <Route path="revenue" element={isAdmin ? <Revenue /> : <Loading />} />

      <Route
        path="history/:id"
        element={isLogged ? <OrderDetails /> : <Loading />}
      />

      <Route path="cart" element={<Cart />} />
      <Route path="checkout" element={isLogged ? <Checkout /> : <Loading />} />

      <Route path="" element={<NotFound />} />
    </Routes>
  );
}
export default Pages;
