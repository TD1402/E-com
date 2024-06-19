import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";
// import 'font-awesome/css/font-awesome.min.css';
import Loading from "../utils/loading/Loading";
import API_URL from "../../../api/baseAPI";

const initialState = {
  // orderItems: [
  //   {
  //     product_id: '639303a2208a1200048b26e7',
  //     type_id: '639303a2208a1200048b26e7',
  //     amount: 1,
  //   },
  // ],
  address: "",
  phone: "",
  shippingCode: "no",
};
const Checkout = () => {
  const state = useContext(GlobalState);
  const [order, setOrder] = useState(initialState);
  const [cart, setCart] = state.userAPI.cart;
  const [process, setProcess] = state.orderAPI.processed;
  const [loading, setLoading] = useState(false);
  console.log("process", process);
  console.log("cart", cart);
  const history = useNavigate();
  const [token] = state.token;
  //const [orderitem,setOrderItem] = useState();
  //console.log(token);
  //const [orders, setOrders] = state.orderAPI.order;
  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  };
  const addToCart = async (cart) => {
    await axios.patch(
      `${API_URL}/user/addcart`,
      { cart },
      {
        headers: { Authorization: token },
      }
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const rs = [];
    for (const test of cart) {
      var obj = {
        product_id: test._id,
        user_cre: test.user_cre,
        type_id: test.types[0]._id,
        amount: test.quantity,
        image: test.images[0].url, // Ensure this line correctly references the image URL
      };
      rs.push(obj);
    }

    const re = {
      orderItems: rs,
      address: order.address,
      phone: order.phone,
      shippingCode: order.shippingCode,
    };

    try {
      const orders = await axios.post(
        `${API_URL}/api/orders`,
        { ...re },
        {
          headers: { Authorization: token },
        }
      );
      setLoading(false);
      setProcess(orders.data.order);
      setCart([]);
      addToCart([]);
      history("/processed");
    } catch (error) {
      console.error("Error placing order:", error);
      setLoading(false);
    }
  };
  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );

  return (
    <div className="body-checkout">
      <h1 style={{ textAlign: "center", marginBottom: "10px" }}>Đặt hàng</h1>
      <div className="row-billing">
        <div className="col-75">
          <div className="container-billing">
            <form onSubmit={handleSubmit}>
              <div className="row-billing">
                <div className="col-50">
                  <h3> Địa chỉ nhận hàng</h3>
                  <label forhtml="adr">
                    <i className="fa fa-address-card-o"></i> Địa chỉ
                  </label>
                  <input
                    type="text"
                    id="address"
                    required
                    value={order.address}
                    onChange={handleChangeInput}
                    name="address"
                    placeholder="Ví dụ:  164 Trần Cao Vân, Tam Thuận, Thanh Khê, Đà Nẵng "
                  />
                  <label forhtml="city">
                    <i className="fa fa-institution"></i> Số điện thoại
                  </label>
                  <input
                    type="text"
                    id="phone"
                    required
                    value={order.phone}
                    onChange={handleChangeInput}
                    name="phone"
                    placeholder="+84 065584-5678."
                  />
                </div>
              </div>

              <button type="submit" className="btn-billing">
                Tiếp tục đặt hàng
              </button>
            </form>
          </div>
        </div>
        <div className="col-25">
          <div className="container-billing">
            <h5>
              Đơn hàng{" "}
              <span className="price" style={{ color: "black" }}>
                <i className="fa fa-shopping-cart"></i> <b>{cart.length}</b>
              </span>
            </h5>
            {cart.map((product, type) => (
              <div key={product._id}>
                <a href="#">{product.title}</a>
                <p>x{product.quantity}</p>
                <img
                  style={{ width: "40px" }}
                  src={product.images[0].url}
                  alt=""
                />

                <span className="price">
                  {product.types[0].price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>
            ))}
            <hr />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
