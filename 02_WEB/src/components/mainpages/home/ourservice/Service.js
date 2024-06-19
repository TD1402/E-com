import "./service.css";
import React, { useContext, useState, useEffect, useRef } from "react";
import { GlobalState } from "../../../../GlobalState";
import ProductItem from "../../utils/productItem/ProductItem";
import Loading from "../../utils/loading/Loading";
import axios from "axios";
import API_URL from "../../../../api/baseAPI";
import Pagination from "../../products/pagination";

export const Service = () => {
  const state = useContext(GlobalState);
  const [productRole1, setProductRole1] = state.productsAPI.productRole1 ?? [];
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const [callback, setCallback] = state.productsAPI.callback;
  const [loading, setLoading] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const topRef = useRef(null); // Tạo tham chiếu tới phần tử trên cùng của trang

  const handleCheck = (id) => {
    productRole1.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });
    setProductRole1([...productRole1]);
  };

  const deleteProduct = async (id, public_id) => {
    try {
      setLoading(true);
      const destroyImg = axios.post(
        `${API_URL}/api/destroy`,
        { public_id },
        {
          headers: { Authorization: token },
        }
      );
      const deleteProduct = axios.delete(`${API_URL}/api/products/${id}`, {
        headers: { Authorization: token },
      });
      await destroyImg;
      await deleteProduct;
      setCallback(!callback);
      alert("Xóa sản phẩm thành công");
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const browserProduct = async (id) => {
    try {
      setLoading(true);
      await axios.put(
        `${API_URL}/api/products/${id}`,
        { role: 1 },
        {
          headers: { Authorization: token },
        }
      );
      setCallback(!callback);
      alert("Cập nhật vai trò sản phẩm thành công");
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const checkAll = () => {
    productRole1.forEach((product) => {
      product.checked = !isCheck;
    });
    setProductRole1([...productRole1]);
    setIsCheck(!isCheck);
  };

  const deleteAll = () => {
    productRole1.forEach((product) => {
      if (product.checked) deleteProduct(product._id, product.images.public_id);
    });
  };

  const BrowserAll = () => {
    productRole1.forEach((product) => {
      if (product.checked) {
        browserProduct(product._id);
      }
    });
  };

  const totalPages = Math.ceil(productRole1.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const currentItems = productRole1.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1); // Đặt lại trang đầu tiên khi cập nhật productRole1
  }, [productRole1]);

  if (loading) return <Loading />;

  return (
    <>
      <div ref={topRef} className="service-main">
        {" "}
        {/* Thêm ref vào đây */}
        <div className="service-top">
          <p className="service-p">Tin đăng mới</p>
        </div>
      </div>

      {isAdmin && (
        <div className="delete-all">
          <button className="check-button" onClick={checkAll} checked={isCheck}>
            {isCheck ? "Bỏ chọn Tất cả" : "Chọn Tất cả"}
          </button>
          <button className="delete-button" onClick={deleteAll}>
            Xóa hết
          </button>
        </div>
      )}

      <div className="services">
        {currentItems.map((product) => (
          <ProductItem
            key={product._id}
            product={product}
            isAdmin={isAdmin}
            deleteProduct={deleteProduct}
            handleCheck={handleCheck}
            className="service-product-item"
          />
        ))}
      </div>

      {productRole1.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePreviousPage={handlePreviousPage}
          handleNextPage={handleNextPage}
          handlePageChange={handlePageChange}
          topRef={topRef} // Truyền topRef vào Pagination
        />
      )}
      {productRole1.length === 0 && <Loading />}
    </>
  );
};
