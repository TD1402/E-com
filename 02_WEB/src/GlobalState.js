import React, { createContext, useState, useEffect } from "react";
import ProductsAPI from "./api/ProductsAPI";
import UserAPI from "./api/UserAPI";
import CategoriesAPI from "./api/CategoriesAPI";
import TypeApi from "./api/TypeAPI";
import OrderApi from "./api/OrderAPI";
import API_URL from "./api/baseAPI";
import axios from "axios";

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(false);

  useEffect(() => {
    const firstLogin = localStorage.getItem("firstLogin");
    const accesstoken = localStorage.getItem("accesstoken");
    console.log({ firstLogin });
    if (firstLogin) {
      const refreshToken = async () => {
        try {
          // const res = await axios.get(`${API_URL}/user/refresh_token`);
          // console.log(res);
          setToken(accesstoken);
          setTimeout(() => {
            refreshToken();
          }, 10 * 60 * 1000);
        } catch (error) {
          console.log(error);
        }
      };

      refreshToken();
    }
  }, []);

  const state = {
    token: [token, setToken],
    productsAPI: ProductsAPI(),
    userAPI: UserAPI(token),
    categoriesAPI: CategoriesAPI(),
    typesAPI: TypeApi(),
    orderAPI: OrderApi(),
  };

  return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};
