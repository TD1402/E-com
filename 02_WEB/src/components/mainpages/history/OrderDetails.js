import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import { Link } from "react-router-dom";
import API_URL from "../../../api/baseAPI";
import axios from "axios";

function OrderDetails() {
  const state = useContext(GlobalState);
  const [history] = state.userAPI.history;
  const [token] = state.token;
  const [review, setReview] = state.orderAPI.reviews;
  const [orderDetails, setOrderDetails] = useState(null); // Change initial state to null
  const [isAdmin] = state.userAPI.isAdmin;
  const params = useParams();

  const updateDeliveryStatus = async (orderId) => {
    try {
      const res = await axios.put(
        `${API_URL}/api/delivery/${orderId}`,
        { delivery: "Confirmed", deliveryDate: new Date(), status: "Paid" },
        { headers: { Authorization: token } }
      );
      if (res.data) {
        setOrderDetails((prevDetails) => ({
          ...prevDetails,
          delivery: "Confirmed",
          status: "Paid",
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (params.id) {
      history.forEach((item) => {
        if (item._id === params.id) {
          setOrderDetails(item);
          setReview(item.listOrderItems);
        }
      });
    }
  }, [params.id, history]);

  const handleConfirmDelivery = (orderId) => {
    if (window.confirm("Bạn có chắc chắn muốn xác nhận đã nhận hàng?")) {
      updateDeliveryStatus(orderId);
      alert("Xác nhận nhận hàng thành công!");
    }
  };

  if (!orderDetails) return null; // Add a check for null orderDetails
  const product = orderDetails.listOrderItems;

  return (
    <div className="history-page">
      {isAdmin ? (
        <>
          <table className="text-center table-bordered">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Địa chỉ</th>
                <th>Số điện thoại</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{orderDetails.user_id}</td>
                <td>{orderDetails.address}</td>
                <td>{orderDetails.phone}</td>
                <td>
                  {orderDetails.delivery === "Confirmed" ? (
                    <div>Hoàn thành</div>
                  ) : (
                    <div>Chưa hoàn thành</div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <table
            className="text-center table-bordered"
            style={{ margin: "30px 0px" }}
          >
            <thead>
              <tr>
                <th></th>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Loại</th>
                <th>Giá</th>
                <th>Đánh giá</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.listOrderItems.map((item) => (
                <tr key={item._id}>
                  <td>
                    <img src={item.image} alt="" />
                  </td>
                  <td>{item.product_name}</td>
                  <td>{item.amount}</td>
                  <td>{item.type_name}</td>
                  <td>
                    {item.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  {isAdmin ? (
                    <td>
                      <Link to={`/detail/${item.product_id}`}>
                        Xem đánh giá của người dùng
                      </Link>
                    </td>
                  ) : (
                    <td>
                      <Link to={`/comment/${item.product_id}`}>Đánh giá</Link>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <table
          className="text-center table-bordered"
          style={{ margin: "30px 0px" }}
        >
          <thead>
            <tr>
              <th></th>
              <th>Sản phẩm</th>
              <th>Số lượng</th>
              <th>Loại</th>
              <th>Giá</th>
              <th>Đánh giá</th>
              <th>Vận chuyển</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.listOrderItems.map((item) => {
              return (
                <tr key={item._id}>
                  <td>
                    <img src={item.image} alt={item.product_name} />
                  </td>
                  <td>{item.product_name}</td>
                  <td>{item.amount}</td>
                  <td>{item.type_name}</td>
                  <td>
                    {item.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                  {isAdmin ? (
                    <td>
                      <Link to={`/detail/${item.product_id}`}>
                        Xem đánh giá của người dùng
                      </Link>
                    </td>
                  ) : (
                    <td>
                      <Link to={`/comment/${item.product_id}`}>Đánh giá</Link>
                    </td>
                  )}
                  <td>
                    {orderDetails.delivery === "transport" ? (
                      <button
                        className="btn btn-primary btn-success"
                        onClick={() => handleConfirmDelivery(orderDetails._id)}
                      >
                        Xác nhận nhận hàng
                      </button>
                    ) : orderDetails.delivery === "process" ? (
                      <div>Hàng đang được xử lý</div>
                    ) : orderDetails.delivery === "Confirmed" ? (
                      <div>Hàng được giao thành công</div>
                    ) : (
                      <div>Đang xử lý</div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrderDetails;
