import React from "react";
import { BsFacebook, BsInstagram, BsGithub } from "react-icons/bs";

// import images from '../../asset/img';

import classNames from "classnames/bind";
import styles from "./Footer.module.scss";
// import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { fa0, faArrowAltCircleRight, faToggleOn } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

export const Footer = () => {
  return (
    <>
      <footer className="site-footer">
        <div className="containers">
          <div className="row-foot">
            <div className="col-sm-12 col-md-6">
              <h6>About</h6>
              <p className="text-justify">
                Chào mừng bạn đến với trang web mua bán đồ cũ hàng đầu! Đây là
                nơi bạn có thể dễ dàng tìm thấy và trao đổi những món đồ cũ
                nhưng còn sử dụng tốt, từ đồ điện tử, nội thất, thời trang cho
                đến đồ gia dụng và nhiều hơn thế nữa. Với mục tiêu tạo ra một
                cộng đồng mua bán tin cậy và tiện lợi, chúng tôi cung cấp nền
                tảng kết nối người bán và người mua một cách nhanh chóng và an
                toàn. Tại đây, bạn không chỉ tiết kiệm được chi phí mà còn góp
                phần bảo vệ môi trường bằng việc tái sử dụng những sản phẩm chất
                lượng. Hãy tham gia ngay để khám phá kho báu đồ cũ đầy thú vị và
                hữu ích!
              </p>
            </div>

            <div className="col-xs-6 col-md-3">
              <h6>Quick Links</h6>
              <ul className="footer-links">
                <li>
                  <a href="">Thông tin về chúng tôi</a>
                </li>
                <li>
                  <a href="">Liên hệ chúng tôi</a>
                </li>
                <li>
                  <a href="">Cửa hàng</a>
                </li>
                <li>
                  <a href="">Thanh toán</a>
                </li>
              </ul>
            </div>
          </div>
          <hr />
        </div>
        <div className="containers">
          <div className="row-foot">
            <div className="col-md-8 col-sm-6 col-xs-12"></div>

            {/* <div className="col-md-4 col-sm-6 col-xs-12">
              <ul className="social-icons">
                <li>
                  <a className="facebook" href="/#">
                    <i className="fa fa-facebook"></i>
                  </a>
                </li>
                <li>
                  <a className="twitter" href="/#">
                    <i className="fa fa-twitter"></i>
                  </a>
                </li>
                <li>
                  <a className="dribbble" href="/#">
                    <i className="fa fa-dribbble"></i>
                  </a>
                </li>
                <li>
                  <a className="linkedin" href="/">
                    <i className="fa fa-linkedin"></i>
                  </a>
                </li>
              </ul>
            </div> */}
          </div>
        </div>
      </footer>
    </>
  );
};
export default Footer;
