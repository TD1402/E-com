import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import "./processed.css";
import axios from "axios";
import Loading from "../utils/loading/Loading";
import API_URL from "../../../api/baseAPI";
import logo from "../../../asset/img/upload_img/logo_momo.png";

const Processed = () => {
  const state = useContext(GlobalState);
  const [process] = state.orderAPI.processed;
  const [token] = state.token;
  const [detail] = state.userAPI.detail;
  const [userDetail, setUserDetail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("visa"); // Track selected payment method

  const history = useNavigate();
  const orderId = process._id;

  useEffect(() => {
    if (detail._id === process.user_id) {
      setUserDetail(detail);
    }
  }, [detail, process.user_id]);

  const tranSuccess = async (id) => {
    if (token) {
      setLoading(true);
      const res = await axios.post(
        `${API_URL}/api/cart/checkout`,
        { order_id: id },
        {
          headers: { Authorization: token },
        }
      );
      setLoading(false);
      if (paymentMethod === "paypal") {
        window.open(res.data.url, "_blank");
      }
      alert("Bạn đã đặt hàng thành công.");
      history("/history");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  const formatCurrencyUSD = (amount) => {
    const exchangeRate = 25400.8;
    const amountInUSD = (amount / exchangeRate).toFixed(2);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amountInUSD);
  };

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );

  return (
    <div className="processed">
      <div className="iphone">
        <div className="header">
          <h1>Thanh Toán</h1>
        </div>
        <div className="form">
          <div>
            <h2>Địa chỉ nhận hàng</h2>
            <div className="card">
              <address>
                {detail._id === process.user_id ? (
                  <div>
                    <b>Tên</b> : {detail.name}
                    <br />
                    <b>Email</b> : {detail.email}
                    <br />
                    <b>Địa chỉ</b> : {process.address}
                    <br />
                    <b>Số điện thoại</b> : {process.phone}
                  </div>
                ) : (
                  <div>
                    <h1>Please checkout your order</h1>
                  </div>
                )}
              </address>
            </div>
          </div>
          <fieldset>
            <legend>Phương thức thanh toán</legend>
            <div className="form__radios">
              <div className="form__radio">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/196/196566.png"
                  alt="PayPal"
                  width="60"
                />
                <span>Thanh toán bằng PayPal</span>
                <label htmlFor="paypal">
                  <svg className="icon">
                    <use href="https://cdn-icons-png.flaticon.com/512/196/196566.png" />
                  </svg>
                </label>
                <input
                  id="paypal"
                  name="payment-method"
                  type="radio"
                  onChange={() => setPaymentMethod("paypal")}
                />
              </div>
              <div className="form__radio">
                <img src={logo} alt="Momo" width="70" />
                <span>Thanh toán bằng Momo</span>
                <label htmlFor="momo">
                  <svg className="icon">
                    <use href="https://cdn-icons-png.flaticon.com/512/732/732223.png" />
                  </svg>
                </label>
                <input
                  id="momo"
                  name="payment-method"
                  type="radio"
                  onChange={() => setPaymentMethod("momo")}
                />
              </div>

              <div className="form__radio">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/216/216486.png"
                  alt="Cash"
                  width="60"
                />
                <span>Thanh toán bằng tiền mặt</span>
                <label htmlFor="cash">
                  <svg className="icon">
                    <use href="https://cdn-icons-png.flaticon.com/512/216/216486.png" />
                  </svg>
                </label>
                <input
                  id="cash"
                  name="payment-method"
                  type="radio"
                  onChange={() => setPaymentMethod("cash")}
                />
              </div>
            </div>
          </fieldset>

          <div className="process-table">
            <h2>Hoá đơn</h2>

            <table className="table table-striped table-sm mt-2 text-center table-bordered">
              <tbody>
                <tr>
                  <td>Phí vận chuyển</td>
                  <td align="right">0 VND</td>
                </tr>
                {paymentMethod === "paypal" ? (
                  <tr>
                    <td>Tổng hoá đơn</td>
                    <td align="right">{formatCurrencyUSD(process.total)}</td>
                  </tr>
                ) : (
                  <tr>
                    <td>Tổng hoá đơn</td>
                    <td align="right">{formatCurrency(process.total)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="btn-processed">
            <button
              className="button button--full"
              onClick={() => tranSuccess(orderId)}
            >
              <svg className="icon">
                <use href="#icon-shopping-bag" />
              </svg>
              Đặt hàng ngay
            </button>
          </div>
        </div>
      </div>
      <div className="process-information"></div>
    </div>
  );
};

export default Processed;
