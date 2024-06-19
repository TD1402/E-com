import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Logo from "../../../asset/img/upload_img/success.png";
import { Link } from "react-router-dom";

const SuccessModal = () => {
  return (
    <div className="main-success">
      <img src={Logo}></img>
      <div className="div-success">Thanh toán thành công!</div>
      <div>
        Cảm ơn bạn đã thanh toán. Biên lai thanh toán sẽ được gửi tự động tới
        email đã đăng ký
      </div>

      <Link className="btn btn-primary btn-success success-button" to="/">
        {"Trở về trang chủ"}
      </Link>
    </div>
  );
};

export default SuccessModal;
