import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";
import Loading from "../utils/loading/Loading";
import Pagination from "../products/pagination";
import API_URL from "../../../api/baseAPI";

function SellHistory() {
  const state = useContext(GlobalState);
  const [allOrder, setAllOrder] = state.orderAPI.allOrder;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [orderDetails, setOrderDetails] = useState([]);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [users, setUsers] = useState([]);

  const product_id = useParams();

  useEffect(() => {
    if (product_id && allOrder.length > 0) {
      const filteredOrders = [];
      allOrder.forEach((order) => {
        order.listOrderItems.forEach((item) => {
          if (item.product_id === product_id.id) {
            filteredOrders.push(order);
            console.log(order);
          }
        });
      });
      setOrderDetails(filteredOrders);
    }

    if (!isUserLoaded) {
      const fetchUsers = async () => {
        try {
          const res = await axios.get(`${API_URL}/user/username`, {
            headers: { Authorization: token },
          });
          setUsers(res.data);
        } catch (err) {
          console.log(err);
        } finally {
          setIsUserLoaded(true);
        }
      };
      fetchUsers();
    }
  }, [product_id, allOrder]);

  const totalPages = Math.ceil(orderDetails.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const updateDeliveryStatus = async (orderId) => {
    try {
      const res = await axios.put(
        `${API_URL}/api/delivery/${orderId}`,
        { delivery: "transport", deliveryDate: new Date() },
        { headers: { Authorization: token } }
      );
      if (res.data) {
        setOrderDetails((prevDetails) =>
          prevDetails.map((order) =>
            order._id === orderId ? { ...order, delivery: "transport" } : order
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmDelivery = (orderId) => {
    if (window.confirm("Bạn có chắc chắn muốn xác nhận chuyển hàng?")) {
      updateDeliveryStatus(orderId);
      alert("Xác nhận chuyển hàng thành công!");
    }
  };

  const currentItems = orderDetails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="history-page">
      <h2>{isAdmin ? "Tất cả Đơn hàng" : "Đơn hàng của tôi"}</h2>
      <h4>{currentItems.length} Đơn hàng</h4>

      {currentItems.length > 0 ? (
        <table className="text-center table-bordered">
          <thead>
            <tr>
              {isAdmin ? (
                <>
                  <th>ID Thanh Toán</th>
                  <th>Ngày mua</th>
                </>
              ) : (
                <th>Tên người mua</th>
              )}
              <th>Tên sản phẩm</th>
              <th>Ngày mua</th>
              <th>Địa chỉ</th>
              <th>Số điện thoại</th>
              <th>Trạng thái</th>
              <th>Vận chuyển</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((items) => (
              <tr key={items._id}>
                {!isAdmin && (
                  <td>
                    {users.find((user) => user._id === items.user_id)?.name}
                  </td>
                )}
                <td>{items.listOrderItems[0].product_name}</td>
                <td>{new Date(items.createdAt).toLocaleDateString()}</td>
                <td>{items.address}</td>
                <td>{items.phone}</td>
                <td>
                  {items.status === "Pending"
                    ? "Đang xử lý"
                    : items.status === "Paid"
                    ? "Đã thanh toán"
                    : items.status}
                </td>
                <td>
                  {items.delivery === "process" ? (
                    <button
                      className="btn btn-primary btn-success"
                      onClick={() => handleConfirmDelivery(items._id)}
                    >
                      Xác nhận chuyển hàng
                    </button>
                  ) : items.delivery === "transport" ? (
                    <div>Hàng đang được giao</div>
                  ) : items.delivery === "Confirmed" ? (
                    <div>Hàng được giao thành công</div>
                  ) : (
                    <div>Đang xử lý</div>
                  )}
                </td>
                <td>
                  <Link to={`/history/${items._id}`}>Xem</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <Loading />
      )}

      {orderDetails.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePreviousPage={handlePreviousPage}
          handleNextPage={handleNextPage}
          handlePageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default SellHistory;
