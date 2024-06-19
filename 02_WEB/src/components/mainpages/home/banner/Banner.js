import React from "react";
import { useRef } from "react";
import styles from "./Banner.module.scss";
import classNames from "classnames/bind";
import logo1 from "../img/logo1.png";
import logo2 from "../img/logo2.png";
import logo3 from "../img/logo3.png";
import logo4 from "../img/logo4.png";
import { useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
const cx = classNames.bind(styles);

function Banner() {
  const navigate = useNavigate();
  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty("--progress", 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };

  return (
    <div className={cx("home-banner")}>
      <div className={cx("banner-container")}>
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          onAutoplayTimeLeft={onAutoplayTimeLeft}
          className="mySwiper"
        >
          <SwiperSlide>
            <img
              className={cx("banner-img")}
              //src="https://www.pfirst.jp/on/demandware.static/Sites-pfirst-Site/-/ja_JP/dw8c09b272/images/petsfirst/hero-mypage.jpeg"
              src="https://media.buyee.jp/lp/images/2023/11/mercari_2311_ogp_ja.png"
              alt="logo1"
            ></img>
          </SwiperSlide>
          <SwiperSlide>
            <img
              className={cx("banner-img")}
              //src="https://www.pfirst.jp/on/demandware.static/-/Sites-pfirst-Library/ja_JP/dwa61b5a19/reservation.jpeg"
              src="https://media.buyee.jp/lp/images/2023/10/rakuten_rakuma_2311_top_sp_ogp_ja.png"
              alt="logo1"
            ></img>
          </SwiperSlide>
          <SwiperSlide>
            <img
              className={cx("banner-img")}
              src="https://media.buyee.jp/lp/images/2023/11/bc_231108_top_sp_ogp_ja.png"
              alt="logo1"
            ></img>
          </SwiperSlide>
          <div className="autoplay-progress" slot="container-end">
            <svg viewBox="0 0 48 48" ref={progressCircle}>
              <circle cx="24" cy="24" r="20"></circle>
            </svg>
            <span ref={progressContent}></span>
          </div>
        </Swiper>
      </div>
      <div className="under-banner">
        <ul className="ul-banner">
          <li className="li-banner" onClick={() => navigate("/create_product")}>
            <div className="div-banner">
              <img src={logo1} alt="Image" />
            </div>
            <p>Bán đồ cũ</p>
          </li>
          <li className="li-banner" onClick={() => navigate("/products")}>
            <div className="div-banner">
              <img src={logo3} alt="Image" />
            </div>
            <p>Mua hàng</p>
          </li>
          <li class="li-banner">
            <div className="div-banner">
              <img src={logo2} alt="Image" />
            </div>
            <p>Săn ưu đãi</p>
          </li>
          <li class="li-banner">
            <div className="div-banner">
              <img src={logo4} alt="Image" />
            </div>
            <p>Đăng tin cho tặng</p>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Banner;
