import React from "react";
import { Service } from "./ourservice/Service";
import Banner from "./banner/Banner";
import { GlobalState } from "../../../GlobalState";
import { useContext, useState } from "react";
import "./home.css";

export const Home = ({ hideHeaderPaths = [] }) => {
  const state = useContext(GlobalState);

  const [products, setProducts] = state.productsAPI.products;
  console.log(products);
  return (
    <>
      <div className="home-container">
        <Banner />
        <Service />
      </div>
    </>
  );
};
