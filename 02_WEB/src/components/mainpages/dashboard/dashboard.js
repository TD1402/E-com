import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { GlobalState } from "../../../GlobalState";
import Loading from "../utils/loading/Loading";
import { Link } from "react-router-dom";
import API_URL from "../../../api/baseAPI";
import "./dashboard.css";
import Pagination from "../products/pagination";

const Dashboard = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [productRole0, setProductRole0] = state.productsAPI.productRole0 ?? [];
  const [productRole1, setProductRole1] = state.productsAPI.productRole1 ?? [];
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [callback, setCallback] = state.productsAPI.callback;
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;
  const [isCheck, setIsCheck] = useState(false);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [history, setHistory] = state.orderAPI.allOrder;
  const [isAdmin] = state.userAPI.isAdmin;
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [isStateTrue, setIsStateTrue] = useState(1);

  useEffect(() => {
    const fetchCategories = async () => {
      if (isAdmin) {
        try {
          const res = await axios.get(`${API_URL}/api/category`);
          setCategories(res.data);
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoaded(true);
        }
      }
    };
    if (!isLoaded) {
      fetchCategories();
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
  }, [token]);

  const deleteProduct = async (id, public_id) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/api/products/${id}`, {
        headers: { Authorization: token },
      });
      window.location.reload();
      alert("Xoá sản phẩm thành công!");
    } catch (err) {
      console.log(err);
    }
  };

  const checkAll = () => {
    const items =
      isStateTrue === 1
        ? productRole0
        : isStateTrue === 2
        ? productRole1
        : users;
    items.forEach((item) => {
      item.checked = !isCheck;
    });
    if (isStateTrue === 1) {
      setProductRole0([...productRole0]);
    } else if (isStateTrue === 2) {
      setProductRole1([...productRole1]);
    } else {
      setUsers([...users]);
    }
    setIsCheck(!isCheck);
  };
  const deleteUser = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/user/deleteUser/${id}`, {
        headers: { Authorization: token },
      });
      window.location.reload();
      alert("Xoá tài khoản người dùng thành công!");
    } catch (err) {
      console.log(err);
    }
  };

  const deleteAll = async () => {
    try {
      setLoading(true);
      let newAcceptedCount = acceptedCount;
      const items =
        isStateTrue === 1
          ? productRole0
          : isStateTrue === 2
          ? productRole1
          : users;
      for (const item of items) {
        if (item.checked === true) {
          if (isStateTrue === 1 || isStateTrue === 2) {
            await axios.delete(`${API_URL}/api/products/${item._id}`, {
              headers: { Authorization: token },
            });
          } else {
            await axios.delete(`${API_URL}/api/user/${item._id}`, {
              headers: { Authorization: token },
            });
          }
          newAcceptedCount -= 1;
          setAcceptedCount(newAcceptedCount);
        }
      }
      if (newAcceptedCount === 0) {
        window.location.reload();
        alert("Xoá tất cả thành công!");
      }
      setCallback(!callback);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const calculateTotalRevenue = (history) => {
    const totalRevenue = history.reduce((accumulator, currentItem) => {
      if (
        currentItem.status === "Paid" &&
        currentItem.delivery === "Confirmed" &&
        !isNaN(currentItem.total)
      ) {
        return accumulator + currentItem.total;
      } else {
        return accumulator;
      }
    }, 0);
    return (totalRevenue * 10) / 100;
  };

  const totalRevenue = calculateTotalRevenue(history);

  const handleCheck = (id) => {
    let newAcceptedCount = acceptedCount;
    const items =
      isStateTrue === 1
        ? productRole0
        : isStateTrue === 2
        ? productRole1
        : users;
    items.forEach((item) => {
      if (item._id === id) {
        item.checked = !item.checked;
        if (item.checked === true) {
          newAcceptedCount += 1;
        } else {
          newAcceptedCount -= 1;
        }
        setAcceptedCount(newAcceptedCount);
      }
    });
    if (isStateTrue === 1) {
      setProductRole0([...productRole0]);
    } else if (isStateTrue === 2) {
      setProductRole1([...productRole1]);
    } else {
      setUsers([...users]);
    }
  };

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "";
  };

  const getSellerName = (userId) => {
    const userMap = {};
    users.forEach((user) => {
      userMap[user._id] = user.name;
    });
    const name = userMap[userId];
    return name ? name : "";
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const acceptProduct = async (id) => {
    try {
      setLoading(true);
      await axios.put(
        `${API_URL}/api/products/role/${id}`,
        { role: 1 },
        {
          headers: { Authorization: token },
        }
      );
      alert("Đăng tải sản phẩm thành công!");
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const acceptAll = async () => {
    let newAcceptedCount = acceptedCount;
    try {
      setLoading(true);
      for (const product of productRole0) {
        if (product.checked === true) {
          await axios.put(
            `${API_URL}/api/products/role/${product._id}`,
            { role: 1 },
            {
              headers: { Authorization: token },
            }
          );
          newAcceptedCount -= 1;
        }
      }
      setAcceptedCount(newAcceptedCount);
      setLoading(false);
      alert("Đăng tải tất cả sản phẩm thành công!");
      window.location.reload();
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredItems = (
    isStateTrue === 1 ? productRole0 : isStateTrue === 2 ? productRole1 : users
  ).filter((item) => {
    if (isStateTrue === 3) {
      return (
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      return (
        getSellerName(item.user_cre)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  });

  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(
    (isStateTrue === 1
      ? productRole0.length
      : isStateTrue === 2
      ? productRole1.length
      : users.length) / itemsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  return (
    <div className="dashboard">
      <div className="container-fluid mt-3">
        <div className="row justify-content-center ">
          <div className="row justify-content-center">
            <div className="col-md-8 ">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4">
              <div className="card text-white bg-primary mb-3">
                <div className="card-header">Tổng doanh thu</div>
                <div className="card-body">
                  <h5 className="card-title">{formatPrice(totalRevenue)} đ</h5>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-white bg-info mb-3">
                <div className="card-header">Tổng số đơn đặt hàng</div>
                <div className="card-body">
                  <h5 className="card-title">{history.length} đơn đặt hàng</h5>
                </div>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <div className="button-container">
              <div className="button-group">
                <div className="left-buttons">
                  <button
                    className="btn btn-sm btn-page mr-2"
                    onClick={() => {
                      setIsStateTrue(1);
                      setCurrentPage(1);
                    }}
                  >
                    Kiểm duyệt bài đăng
                  </button>
                  <button
                    className="btn btn-sm btn-page mr-2"
                    onClick={() => {
                      setIsStateTrue(2);
                      setCurrentPage(1);
                    }}
                  >
                    Quản lý bài đăng
                  </button>
                  <button
                    className="btn btn-sm btn-page mr-2"
                    onClick={() => {
                      setIsStateTrue(3);
                      setCurrentPage(1);
                    }}
                  >
                    Quản lý người dùng
                  </button>
                </div>
                <div className="right-buttons">
                  {isStateTrue === 1 && (
                    <button
                      className="btn btn-sm btn-success mr-2"
                      onClick={acceptAll}
                    >
                      Duyệt tất cả
                    </button>
                  )}
                  <button className="btn btn-sm btn-danger" onClick={deleteAll}>
                    Xoá hết
                  </button>
                  <div className="checkbox-all">
                    <input
                      type="checkbox"
                      className="small-checkbox"
                      checked={isCheck}
                      onChange={checkAll}
                    />
                  </div>
                </div>
              </div>
            </div>

            {isStateTrue === 1 ? (
              <>
                {productRole0.length === 0 ? (
                  <div>Không có sản phẩm nào chờ xét duyệt</div>
                ) : (
                  <div>
                    <table className="table table-striped table-sm mt-2 text-center table-bordered ">
                      <thead>
                        <tr>
                          <th>Tên người đăng</th>
                          <th>Tiêu đề bài đăng</th>
                          <th>Số lượng</th>
                          <th>Loại sản phẩm</th>
                          <th>Giá</th>
                          <th>Ngày đăng</th>
                          <th>Chi tiết</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((product) => (
                          <tr key={product._id}>
                            <td>{getSellerName(product.user_cre)}</td>
                            <td>{product.title}</td>
                            <td>
                              {product.types && product.types.length > 0
                                ? product.types[0].amount
                                : "N/A"}
                            </td>
                            <td>{getCategoryName(product.category)}</td>
                            <td>
                              {product.types && product.types.length > 0
                                ? product.types[0].price.toLocaleString(
                                    "vi-VN",
                                    {
                                      style: "currency",
                                      currency: "VND",
                                    }
                                  )
                                : "N/A"}
                            </td>
                            <td>{formatDate(product.createdAt)}</td>
                            <td>
                              <Link to={`/detail/${product._id}`}>Xem</Link>
                            </td>
                            <td className="action-buttons">
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => acceptProduct(product._id)}
                              >
                                Duyệt
                              </button>
                              <button className="btn btn-sm btn-primary">
                                <Link to={`/edit_product/${product._id}`}>
                                  Chỉnh sửa
                                </Link>
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() =>
                                  deleteProduct(
                                    product._id,
                                    product.images.public_id
                                  )
                                }
                              >
                                Xoá
                              </button>
                            </td>
                            <td className="action-checkbox">
                              <input
                                type="checkbox"
                                className="small-checkbox"
                                checked={product.checked}
                                onChange={() => handleCheck(product._id)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {productRole0.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePreviousPage={handlePreviousPage}
                    handleNextPage={handleNextPage}
                    handlePageChange={handlePageChange}
                  />
                )}
              </>
            ) : isStateTrue === 2 ? (
              <>
                {productRole1.length === 0 ? (
                  <div>Không có sản phẩm nào chờ xét duyệt</div>
                ) : (
                  <div>
                    <table className="table table-striped table-sm mt-2 text-center table-bordered">
                      <thead>
                        <tr>
                          <th>Tên người đăng</th>
                          <th>Tiêu đề bài đăng</th>
                          <th>Số lượng</th>
                          <th>Loại sản phẩm</th>
                          <th>Giá</th>
                          <th>Ngày đăng</th>
                          <th>Chi tiết</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((product) => (
                          <tr key={product._id}>
                            <td>{getSellerName(product.user_cre)}</td>
                            <td>{product.title}</td>
                            <td>
                              {product.types && product.types.length > 0
                                ? product.types[0].amount
                                : "N/A"}
                            </td>
                            <td>{getCategoryName(product.category)}</td>
                            <td>
                              {product.types && product.types.length > 0
                                ? product.types[0].price.toLocaleString(
                                    "vi-VN",
                                    {
                                      style: "currency",
                                      currency: "VND",
                                    }
                                  )
                                : "N/A"}
                            </td>
                            <td>{formatDate(product.createdAt)}</td>
                            <td>
                              <Link to={`/detail/${product._id}`}>Xem</Link>
                            </td>
                            <td className="action-buttons">
                              <button className="btn btn-sm btn-primary">
                                <Link to={`/edit_product/${product._id}`}>
                                  Chỉnh sửa
                                </Link>
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() =>
                                  deleteProduct(
                                    product._id,
                                    product.images.public_id
                                  )
                                }
                              >
                                Xoá
                              </button>
                            </td>
                            <td className="action-checkbox">
                              <input
                                type="checkbox"
                                className="small-checkbox"
                                checked={product.checked}
                                onChange={() => handleCheck(product._id)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {productRole1.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePreviousPage={handlePreviousPage}
                    handleNextPage={handleNextPage}
                    handlePageChange={handlePageChange}
                  />
                )}
              </>
            ) : isStateTrue === 3 ? (
              <div>
                <table className="table table-striped table-sm mt-2 text-center table-bordered">
                  <thead>
                    <tr>
                      <th>Tên người dùng</th>
                      <th>Email</th>
                      <th>Ngày đăng ký</th>
                      <th>Địa chỉ</th>
                      <th>Số điện thoại</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>{user.role}</td>
                        <td>{user.phone}</td>
                        <td className="action-buttons">
                          <button className="btn btn-sm btn-primary">
                            Chỉnh sửa
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteUser(user._id)}
                          >
                            Xoá
                          </button>
                        </td>
                        <td className="action-checkbox">
                          <input
                            type="checkbox"
                            className="small-checkbox"
                            checked={user.checked}
                            onChange={() => handleCheck(user._id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePreviousPage={handlePreviousPage}
                    handleNextPage={handleNextPage}
                    handlePageChange={handlePageChange}
                  />
                )}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
