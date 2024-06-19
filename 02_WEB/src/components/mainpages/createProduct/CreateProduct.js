import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { GlobalState } from "../../../GlobalState";
import Loading from "../utils/loading/Loading";
import { useNavigate, useParams } from "react-router-dom";
import API_URL from "../../../api/baseAPI";
import { AiOutlineCloseCircle } from "react-icons/ai";
import "./createProduct.css";

const initialState = {
  title: "",
  description: "",
  category: "",
  _id: "",
  types: [
    {
      id: Date.now(),
      name: "",
      price: 0,
      amount: 0,
    },
  ],
};

function CreateProduct() {
  const state = useContext(GlobalState);
  const user_cre = state.userAPI.userID[0];
  const [product, setProduct] = useState(initialState);
  const [categories] = state.categoriesAPI.categories;
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const history = useNavigate();
  const param = useParams();
  const [products] = state.productsAPI.products;
  const [onEdit, setOnEdit] = useState(false);
  const [callback, setCallback] = state.productsAPI.callback;
  const [edit, setEdit] = useState(initialState);

  useEffect(() => {
    if (param.id) {
      setOnEdit(true);
      products.forEach((product) => {
        if (product._id === param.id) {
          setEdit(product);
          setImages(product.images);
        }
      });
    } else {
      setOnEdit(false);
      setProduct(initialState);
      setImages([]);
    }
  }, [param.id, products]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files);

    const newImages = [];

    for (const file of files) {
      if (!file) {
        alert("The file is not correct.");
        return;
      }

      if (file.size > 1024 * 1024) {
        alert("Image is too large. Please try again.");
        return;
      }

      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        alert("The file is not correct. Please check again.");
        return;
      }

      let formData = new FormData();
      formData.append("file", file);

      setLoading(true);
      try {
        const res = await axios.post(`${API_URL}/api/upload`, formData, {
          headers: {
            "content-type": "multipart/form-data",
            Authorization: token,
          },
        });
        newImages.push(res.data);
      } catch (err) {
        alert(err.response.data.msg);
        setLoading(false);
        return;
      }
    }

    setImages((prevImages) => [...prevImages, ...newImages].slice(0, 5));
    setLoading(false);
  };

  const handleDestroy = async (public_id) => {
    try {
      setLoading(true);
      await axios.post(
        `${API_URL}/api/destroy`,
        { public_id },
        {
          headers: { Authorization: token },
        }
      );
      setImages((prevImages) =>
        prevImages.filter((image) => image.public_id !== public_id)
      );
      setLoading(false);
    } catch (err) {
      alert(err.response.data.msg);
      setLoading(false);
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    if (onEdit) {
      setEdit({ ...edit, [name]: value });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  const handleChangeInputEdit = (e, index) => {
    const { name, value } = e.target;
    const updatedTypes = onEdit ? [...edit.types] : [...product.types];

    if (name === "price") {
      const formattedValue = value.replace(/\D/g, "").slice(0, 11);
      updatedTypes[index] = { ...updatedTypes[index], [name]: formattedValue };
    } else {
      updatedTypes[index] = { ...updatedTypes[index], [name]: value };
    }

    if (onEdit) {
      setEdit({ ...edit, types: updatedTypes });
    } else {
      setProduct({ ...product, types: updatedTypes });
    }
  };

  const addType = () => {
    const newType = { id: Date.now(), name: "", price: 0, amount: 0 };
    if (onEdit) {
      setEdit({ ...edit, types: [...edit.types, newType] });
    } else {
      setProduct({ ...product, types: [...product.types, newType] });
    }
  };

  const removeType = (id) => {
    if (onEdit) {
      setEdit({ ...edit, types: edit.types.filter((type) => type.id !== id) });
    } else {
      setProduct({
        ...product,
        types: product.types.filter((type) => type.id !== id),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (images.length === 0) return alert("Image not uploaded");

      const rs = {
        title: product.title,
        description: product.description,
        category: product.category,
        types: onEdit ? edit.types : product.types,
        role: isAdmin ? 1 : 0,
      };

      if (onEdit) {
        console.log(edit);
        await axios.put(
          `${API_URL}/api/products/${edit._id}`,
          { ...edit, images },
          {
            headers: { Authorization: token },
          }
        );
      } else {
        await axios.post(
          `${API_URL}/api/products`,
          { ...rs, images, user_cre },
          {
            headers: { Authorization: token },
          }
        );
      }

      alert(
        onEdit
          ? "Chỉnh sửa sản phẩm thành công!"
          : isAdmin
          ? "Đăng tải sản phẩm thành công!"
          : "Đăng tải sản phẩm thành công, Vui lòng chờ xét duyệt!"
      );
      setCallback(!callback);
      history("/products");
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  return (
    <div className="create_product">
      <div className="upload">
        {loading ? (
          <div id="file_img" className="no-line">
            <Loading />
          </div>
        ) : (
          <input
            type="file"
            name="file"
            id="file_up"
            onChange={handleUpload}
            multiple
          />
        )}
        {images.map((image, index) => (
          <div key={index} id="file_img">
            <div className="file-img-load">
              <img
                src={image.url}
                alt=""
                style={{ border: index === 0 ? "2px solid red" : "none" }}
              />
              <span onClick={() => handleDestroy(image.public_id)}>X</span>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <label htmlFor="categories">Danh mục: </label>
          <select
            className="category"
            name="category"
            value={onEdit ? edit.category : product.category}
            onChange={handleChangeInput}
          >
            <option value="">Danh mục tin đăng</option>
            {categories.map((category) => (
              <option value={category._id} key={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="row">
          <label htmlFor="title">Tiêu đề của sản phẩm</label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={onEdit ? edit.title : product.title}
            onChange={handleChangeInput}
          />
        </div>
        <div className="add-type-container">
          <div className="row-type ">
            {(onEdit ? edit.types : product.types).map((item, index) => (
              <div key={index}>
                <div>
                  <label>Phân loại</label>
                  <input
                    type="text"
                    name="name"
                    value={item.name || ""}
                    onChange={(e) => handleChangeInputEdit(e, index)}
                  />
                </div>
                <div>
                  <label>Giá</label>
                  <input
                    type="text"
                    name="price"
                    value={formatPrice(item.price) || ""}
                    onChange={(e) => handleChangeInputEdit(e, index)}
                  />
                </div>
                <div>
                  <label>Số lượng</label>
                  <input
                    type="text"
                    name="amount"
                    value={item.amount || ""}
                    onChange={(e) => handleChangeInputEdit(e, index)}
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="add-type-button custom-add-type"
            onClick={addType}
          >
            Add Type
          </button>

          <table className="types-table ">
            <thead>
              <tr>
                <th>Loại sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {(onEdit ? edit.types : product.types).map((type) => (
                <tr key={type.id}>
                  <td>{type.name}</td>
                  <td>{formatPrice(type.price)}</td>
                  <td>{type.amount}</td>
                  <td>
                    <button onClick={() => removeType(type.id)}>
                      <AiOutlineCloseCircle />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="row">
          <label htmlFor="description">Mô tả chi tiết</label>
          <textarea
            type="text"
            name="description"
            id="description"
            placeholder="Thông tin chi tiết của sản phẩm:
                          - Nhã hiệu, xuất xứ
                          - Tình trạng sản phẩm
                          - Kích thước
                          - Địa chỉ, thông tin liên hệ
                          - Chính sách bảo hành"
            required
            value={onEdit ? edit.description : product.description}
            rows="10"
            onChange={handleChangeInput}
          />
        </div>

        <button type="submit">{onEdit ? "Chỉnh sửa" : "Xác nhận"}</button>
      </form>
    </div>
  );
}

export default CreateProduct;
