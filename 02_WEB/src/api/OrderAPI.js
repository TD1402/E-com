import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "./baseAPI";

function OrderAPI(token) {
  const [order, setOrder] = useState([]);
  const [allOrder, setAllOrder] = useState([]);
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [callback, setCallback] = useState(false);
  const [processed, setProcessed] = useState([]);
  const [review, setReview] = useState([]);
  const [check, serCheck] = useState(false);

  useEffect(() => {
    const getOrder = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/orders`);
        setOrder(res.data);
      } catch (err) {
        alert(err.response.data.msg);
      }
    };
    getOrder();

    const getAllOrder = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/orders/payment`, {
          headers: { Authorization: token },
        });
        const allOrders = res.data;
        setAllOrder(allOrders);
      } catch (err) {
        console.log(err);
      }
    };
    getAllOrder();
  }, [callback]);
  const AddOrder = async (product, type) => {
    if (!isLogged) return alert("Please login to continue buying OderAPI");
  };
  return {
    allOrder: [allOrder, setAllOrder],
    order: [order, setOrder],
    callback: [callback, setCallback],
    processed: [processed, setProcessed],
    reviews: [review, setReview],
    check: [check, serCheck],
  };
}

export default OrderAPI;
