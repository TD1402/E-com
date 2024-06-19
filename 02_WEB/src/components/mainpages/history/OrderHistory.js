import React, { useContext, useEffect, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "../utils/loading/Loading";
import ItemCorrect from "./ItemCorrect";
import API_URL from "../../../api/baseAPI";
import Pagination from "../products/pagination";

function OrderHistory() {
  const state = useContext(GlobalState);
  const [history, setHistory] = state.userAPI.history;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (token) {
      const getHistory = async () => {
        let res;
        if (isAdmin) {
          res = await axios.get(`${API_URL}/api/orders/admin?`, {
            headers: { Authorization: token },
          });
        } else {
          res = await axios.get(`${API_URL}/api/orders?`, {
            headers: { Authorization: token },
          });
        }
        setHistory(res.data);
      };
      getHistory();
    }
  }, [token]);

  // Calculate total pages based on actual number of items
  const totalPages = Math.ceil(history.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const currentItems = history.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="history-page">
      <h2>{isAdmin ? "Tất cả Đơn hàng" : "Đơn hàng của tôi"}</h2>
      <h4>{history.length} Đơn hàng</h4>
      {history.length > 0 ? (
        isAdmin ? (
          <table className="text-center table-bordered">
            <thead>
              <tr>
                <th>ID Thanh Toán</th>
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
                <ItemCorrect key={items._id} item={items} />
              ))}
            </tbody>
          </table>
        ) : (
          <table className="text-center table-bordered">
            <thead>
              <tr>
                <th>Ngày mua</th>
                <th>Địa chỉ</th>
                <th>Số điện thoại</th>
                <th>Trạng thái</th>
                <th>Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((items) => (
                <tr key={items._id}>
                  <td>{new Date(items.createdAt).toLocaleDateString()}</td>
                  <td>{items.address}</td>
                  <td>{items.phone}</td>
                  <td>
                    {items.status === "Pending"
                      ? "Đang xử lý thanh toán"
                      : items.status === "Paid"
                      ? "Đã thanh toán"
                      : items.status}
                  </td>

                  <td>
                    <Link to={`/history/${items._id}`}>Xem</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      ) : (
        <Loading />
      )}
      {history.length > 0 && (
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

export default OrderHistory;
