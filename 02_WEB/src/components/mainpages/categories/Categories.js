import React, { useState, useContext } from "react";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";
import API_URL from "../../../api/baseAPI";

function Categories() {
  const state = useContext(GlobalState);
  const [categories] = state.categoriesAPI.categories;
  const [category, setCategory] = useState("");
  const [token] = state.token;
  const [callback, setCallback] = state.categoriesAPI.callback;
  const [onEdit, setOnEdit] = useState(false);
  const [id, setID] = useState("");

  const createCategory = async (e) => {
    e.preventDefault();
    try {
      if (onEdit) {
        const res = await axios.put(
          `${API_URL}/api/category/${id}`,
          { name: category },
          {
            headers: { Authorization: token },
          }
        );
        alert("Success");
      } else {
        const res = await axios.post(
          `${API_URL}/api/category`,
          { name: category },
          {
            headers: { Authorization: token },
          }
        );
        alert("Success");
      }
      setOnEdit(false);
      setCategory("");
      setCallback(!callback);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const editCategory = async (id, name) => {
    setID(id);
    setCategory(name);
    setOnEdit(true);
  };

  /* const deleteCategory = async id =>{
        try {
            const res = await axios.delete(`/api/category/${id}`, {
                headers: {Authorization: token}
            })
            
            alert(res.data.msg)
            setCallback(!callback)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }*/
  const deleteCategory = async (id) => {
    try {
      // Hiển thị hộp thoại xác nhận
      const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa không?");

      // Nếu người dùng xác nhận, thực hiện xóa
      if (isConfirmed) {
        const res = await axios.delete(`${API_URL}/api/category/${id}`, {
          headers: { Authorization: token },
        });

        alert(res.data.msg);
        setCallback(!callback);
      } else {
        // Người dùng không xác nhận, không thực hiện xóa
        alert("Thao tác xóa đã được hủy bỏ");
      }
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <div className="categories">
      <form onSubmit={createCategory}>
        <label htmlFor="category">Categories</label>
        <input
          type="text"
          name="category"
          value={category}
          required
          onChange={(e) => setCategory(e.target.value)}
        />

        <button type="submit">{onEdit ? "Chỉnh sửa" : "Tạo mới"}</button>
      </form>

      <div className="col">
        {categories.map((category) => (
          <div className="row" key={category._id}>
            <p>{category.name}</p>
            <div>
              <button
                className="btn-primary"
                onClick={() => editCategory(category._id, category.name)}
              >
                Chỉnh sửa
              </button>
              <button onClick={() => deleteCategory(category._id)}>Xoá</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
