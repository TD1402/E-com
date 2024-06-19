import React, { useContext, useState, useRef, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import ProductItem from "../utils/productItem/ProductItem";
import Loading from "../utils/loading/Loading";
import axios from "axios";
import Filters from "./Filters";
import Pagination from "./pagination";
import { Link } from "react-router-dom";
import API_URL from "../../../api/baseAPI";
import "./products.css";

function Products() {
  const state = useContext(GlobalState);
  const [productRole1, setProductRole1] = state.productsAPI.productRole1 ?? [];
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const [callback, setCallback] = state.productsAPI.callback;
  const [loading, setLoading] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [imageSearch, setImageSearch] = useState([]);
  const itemsPerPage = 12;
  const topRef = useRef(null);
  const [productSearch, setProductSearch] = useState([]);
  const [isHidden, setIsHidden] = useState(false);

  const handleHide = () => {
    setIsHidden(true); // Thiết lập isHidden thành true khi nhấn nút X
  };

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
      alert("Product deleted successfully");
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const checkAll = () => {
    productRole1?.forEach((product) => {
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

  const currentItems = productRole1.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(productRole1.length / itemsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    console.log("do dai", imageSearch);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    console.log("do dai", orderedMatchingProducts);
  };
  const matchingProducts = [];

  imageSearch.forEach((searchItem) => {
    // Duyệt qua mỗi sản phẩm trong productRole1 để so sánh
    productRole1.forEach((product) => {
      // Duyệt qua mỗi ảnh của sản phẩm
      product.images.forEach((image) => {
        // So sánh URL của ảnh với URL trong imageSearch
        if (image.url === searchItem.image) {
          // Nếu URL giống nhau, thêm sản phẩm vào mảng matchingProducts
          matchingProducts.push(product);
        }
      });
    });
  });

  // Giữ nguyên thứ tự của imageSearch bằng cách sử dụng map để tạo một mảng mới theo thứ tự của imageSearch
  const orderedMatchingProducts = imageSearch.map((searchItem) => {
    // Tìm sản phẩm tương ứng trong matchingProducts dựa trên URL của ảnh
    const product = matchingProducts.find((p) => {
      return p.images.some((image) => image.url === searchItem.image);
    });
    return product; // Trả về sản phẩm tìm được
  });

  useEffect(() => {
    setCurrentPage(1); // Đặt lại trang đầu tiên khi cập nhật productRole1
  }, [productRole1]);

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );

  return (
    <>
      <Filters
        setImageSearch={setImageSearch}
        setProductSearch={setProductSearch}
        setIsHidden={setIsHidden}
      />
      <div>
        {orderedMatchingProducts.length > 0 && !isHidden && (
          <div className="products">
            <button className="close-button" onClick={handleHide}>
              X
            </button>
            {orderedMatchingProducts.map(
              (product) =>
                product &&
                product._id &&
                product.category &&
                product.images && (
                  <ProductItem
                    key={product._id}
                    product={product}
                    isAdmin={isAdmin}
                    deleteProduct={deleteProduct}
                    handleCheck={handleCheck}
                  />
                )
            )}
          </div>
        )}
      </div>
      <div ref={topRef} className="header-information">
        {" "}
        {/* Thêm ref vào đây */}
        <p className="header-label">Cửa hàng</p>
        <div className="header-direction">
          <Link to="/">Trang chủ /</Link>
          <Link to="/products">Cửa hàng</Link>
        </div>
      </div>

      {isAdmin && (
        <div className="delete-all">
          <button className="check-button" onClick={checkAll} checked={isCheck}>
          {isCheck ? "Bỏ chọn Tất cả" : "Chọn Tất cả"}
          </button>
          <button onClick={deleteAll}>Xoá hết</button>
        </div>
      )}
      <div className="products">
        {currentItems?.map((product) => {
          return (
            <ProductItem
              key={product._id}
              product={product}
              isAdmin={isAdmin}
              deleteProduct={deleteProduct}
              handleCheck={handleCheck}
            />
          );
        })}
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
      {productRole1?.length === 0 && <Loading />}
    </>
  );
}

export default Products;
