import React, { useContext, useState, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import API_URL from "../../../api/baseAPI";
import Loading from "../utils/loading/Loading";

function Filters({ setImageSearch, setIsHidden }) {
  const state = useContext(GlobalState);
  const [categories] = state.categoriesAPI.categories;

  const [category, setCategory] = state.productsAPI.category;
  const [sort, setSort] = state.productsAPI.sort;
  const [search, setSearch] = state.productsAPI.search;
  const [image, setImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState(false);
  const [imageAi, setImageAi] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    console.log("Categories:", categories); // Log the categories array
    console.log(
      "Categories Structure:",
      categories.map((cat) => ({ name: cat.name, id: cat._id }))
    );
  }, [categories, sort]);

  const handleCategory = (e) => {
    setCategory(e.target.value);
    setSearch("");
  };

  const handleImageUpload = () => {
    setShowModal(true);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];

      if (!file) return alert("The file is not correct.");

      if (file.size > 1024 * 1024)
        return alert("Image is large. Please try again");

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return alert("The file is not correct. Please check again");

      let formData = new FormData();
      formData.append("file", file);

      setLoading(true);
      const res = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      setLoading(false);
      setImages(res.data);
      setImageAi(file);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDestroy = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/api/destroy`, {
        public_id: images.public_id,
      });
      setLoading(false);
      setImages(false);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const styleUpload = {
    display: images ? "block" : "none",
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      // Gửi hình ảnh để dự đoán danh mục
      let formData = new FormData();
      formData.append("image", imageAi);
      const res = await axios.post(
        "http://localhost:8000/image-search",
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      );

      // Trích xuất tên danh mục từ phản hồi
      const categoryName = res.data.trim();
      console.log("Tên danh mục:", categoryName);

      // Tìm danh mục phù hợp từ danh sách các danh mục
      const matchedCategory = categories.find(
        (cat) => cat.name.trim().toLowerCase() === categoryName.toLowerCase()
      );

      if (matchedCategory) {
        // Đặt trạng thái danh mục dựa trên danh mục phù hợp
        // setCategory(`category=${matchedCategory._id}`);

        // Lấy danh sách sản phẩm dựa trên danh mục phù hợp
        const productsRes = await axios.get(
          `${API_URL}/api/products?category=${matchedCategory._id}`
        );
        const productsData = productsRes.data.products;

        // Trích xuất các URL hình ảnh từ productsData
        const productImages = productsData.map(
          (product) => product.images[0].url
        );

        // Đảm bảo mảng productImages không rỗng trước khi gửi để phân tích
        if (productImages.length > 0) {
          // Gửi các hình ảnh sản phẩm đến máy chủ AI để phân tích
          const analysisRes = await axios.post(
            "http://localhost:8000/product-analysis",
            productImages
          );
          const analyzedProducts = analysisRes.data;
          console.log("Các sản phẩm đã được phân tích:", analyzedProducts);
          // Xử lý các sản phẩm đã được phân tích theo cách cần thiết...

          // Hiển thị các sản phẩm đã được phân tích từ trên xuống
          setImageSearch(analyzedProducts);
          setShowModal(false);
          setIsHidden(false);
        } else {
          throw new Error("Không tìm thấy hình ảnh sản phẩm để phân tích.");
        }
      } else {
        // Không tìm thấy danh mục phù hợp
        alert("Dữ liệu chưa có danh mục phù hợp.");
      }
    } catch (err) {
      // Xử lý lỗi
      console.error("Lỗi khi xử lý hình ảnh:", err);
      alert("Không thể xử lý hình ảnh.");
    }
    setIsProcessing(false);
  };

  return (
    <div className="filter_menu">
      <div className="row">
        <select name="category" value={category} onChange={handleCategory}>
          <option value="">Tất cả danh mục</option>
          {categories.map((category) => (
            <option value={"category=" + category._id} key={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <input
        className="search-input"
        type="text"
        value={search}
        placeholder="Tìm kiếm"
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
      />

      <FontAwesomeIcon
        icon={faCamera}
        className="camera-icon"
        onClick={handleImageUpload}
      />

      <input
        type="file"
        id="fileInput"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <div className="row sort">
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Sản phẩm mới</option>
          <option value="sort=oldest">Sản phẩm cũ</option>
          <option value="sort=-price">Giá : cao-thấp</option>
          <option value="sort=price">Giá: thấp-cao</option>
        </select>
      </div>

      {showModal && (
        <div className="modal-product">
          <div className="modal-content-product">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <div className="modal-search-image">
              <p>Tìm kiếm bằng hình ảnh</p>
            </div>
            <div className="modal-upload">
              <input
                type="file"
                name="file"
                id="modal-fileup"
                onChange={handleUpload}
              />
              {loading ? (
                <div
                  id="modal_file_img"
                  className="no-line d-flex justify-content-center align-items-center"
                >
                  <div className="spinner-grow" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div id="modal_file_img" style={styleUpload}>
                  <img src={images ? images.url : ""} alt="" />
                  <span onClick={handleDestroy}>X</span>
                </div>
              )}
            </div>
            <button
              className="modal-button"
              onClick={handleSubmit}
              disabled={isProcessing}
            >
              {isProcessing ? "Đang xử lý..." : "Xác nhận"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Filters;
