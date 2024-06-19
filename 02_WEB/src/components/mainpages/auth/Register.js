import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import classNames from "classnames/bind";
import styles from "./Register.module.scss";
import API_URL from "../../../api/baseAPI";
const cx = classNames.bind(styles);

function Register() {
  const [user, setUser] = useState({
    name: "",
    lname: "",
    phone: "",
    email: "",
    password: "",
  });

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const registerSubmit = async (e) => {
    e.preventDefault();
    try {
      // Xóa toàn bộ localStorage
      localStorage.clear();

      // Thực hiện đăng ký
      const res = await axios.post(`${API_URL}/user/register`, { ...user });
      localStorage.setItem("firstLogin", true);
      localStorage.setItem("accesstoken", res?.data?.accesstoken);

      // Chuyển hướng đến trang chủ
      window.location.href = "/";
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <section
      className="vh-150 main-login"
      style={{ backgroundColor: "#508bfc" }}
    >
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div
              className="card shadow-2-strong"
              style={{
                border: "solid 3px #ffffff",
                borderRadius: "1rem",
                backgroundColor: "rgba(255, 255, 255,0.1)",
              }}
            >
              <div className="card-body p-5 text-center">
                <h3 className="mb-5 text-white" style={{ color: "#ffffff" }}>
                  Đăng kí
                </h3>

                <div
                  className="form-outline mb-4"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <input
                    type="text"
                    name="name"
                    id="typeTextX-2"
                    placeholder="Tên người dùng"
                    className="form-control form-control-lg"
                    value={user.name}
                    onChange={onChangeInput}
                  />
                </div>

                <div
                  className="form-outline mb-4"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Số điện thoại"
                    id="typePhoneX-2"
                    className="form-control form-control-lg"
                    value={user.phone}
                    onChange={onChangeInput}
                    pattern="[0-9]{10}"
                  />
                </div>

                <div
                  className="form-outline mb-4"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="form-control form-control-lg"
                    value={user.email}
                    onChange={onChangeInput}
                  />
                </div>

                <div
                  className="form-outline mb-4"
                  style={{ backgroundColor: "#ffffff" }}
                >
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    id="typePasswordX-2"
                    className="form-control form-control-lg"
                    value={user.password}
                    onChange={onChangeInput}
                  />
                </div>

                <button
                  className="btn btn-primary btn-lg btn-block"
                  type="submit"
                  onClick={registerSubmit}
                >
                  Đăng kí
                </button>

                <hr className="my-4" />

                <button
                  className="btn btn-lg btn-block btn-primary"
                  style={{ backgroundColor: "#dd4b39" }}
                  type="submit"
                >
                  <FaGoogle className="me-2" /> Đăng nhập bằng Google
                </button>
                <button
                  className="btn btn-lg btn-block btn-primary mb-2"
                  style={{ backgroundColor: "#3b5998" }}
                  type="submit"
                >
                  <FaFacebook className="me-2" />
                  Đăng nhập bằng Facebook
                </button>
                <div className="mt-3">
                  <p className="text-white mb-0">
                    Đã có tài khoản?{" "}
                    <Link to="/login" className="text-white fw-bold">
                      Đăng nhập ngay
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
