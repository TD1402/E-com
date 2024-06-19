import React, { useContext, useState } from "react";
import { GlobalState } from "../../GlobalState";
import Menu from "../Header/icon/icons8-menu.svg";
import { Link } from "react-router-dom";
import axios from "axios";
import { BiUser } from "react-icons/bi";
import { HiOutlineLogout } from "react-icons/hi";
import { AiOutlineHistory, AiOutlineHeart } from "react-icons/ai";
import { gsap } from "gsap";
import API_URL from "../../api/baseAPI";

function Header({ hideFooter }) {
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;
  const [cart] = state.userAPI.cart;
  const [menu, setMenu] = useState(false);

  const hideFooterOnClick = () => {
    hideFooter(); // Gọi hàm hideFooter từ prop khi click vào phần tử muốn ẩn footer
  };
  const onEnter = ({ currentTarget }) => {
    gsap.to(currentTarget, {
      repeatDelay: 1,
      yoyo: true,
      scale: 1.3,
    });
  };
  const onLeave = ({ currentTarget }) => {
    gsap.to(currentTarget, { scale: 1 });
  };

  const logoutUser = async () => {
    await axios.get(`${API_URL}/user/logout`);
    localStorage.removeItem("firstLogin");
    window.location.href = "/";
  };
  const ToggleSidebar = () => {
    const [isOpen, setIsopen] = useState(false);
    const ToggleSidebar = () => {
      isOpen === true ? setIsopen(false) : setIsopen(true);
    };
    return (
      <>
        <div className="btn btn-primary" onClick={ToggleSidebar}>
          <img src={Menu} alt="" width="30" />
          <div className={`sidebar ${isOpen === true ? "active" : ""}`}>
            <div className="sd-body">
              <ul>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/category">Thêm Category</Link>
                </li>
                <li>
                  <Link to="/create_product">Thêm sản phẩm</Link>
                </li>
              </ul>
            </div>
          </div>
          <div
            className={`sidebar-overlay ${isOpen === true ? "active" : ""}`}
            onClick={ToggleSidebar}
          ></div>
        </div>
      </>
    );
  };

  const adminRouter = () => {
    return (
      <>
        <ToggleSidebar />
      </>
    );
  };

  const loggedRouter = () => {
    return (
      <>
        <li onMouseEnter={onEnter} onMouseLeave={onLeave}>
          <Link to="/history">
            <AiOutlineHistory />
          </Link>
        </li>
        <li onMouseEnter={onEnter} onMouseLeave={onLeave}>
          <Link to="/infor">
            <BiUser />
          </Link>
        </li>
        <li onMouseEnter={onEnter} onMouseLeave={onLeave}>
          <Link to="/" onClick={logoutUser}>
            <HiOutlineLogout />
          </Link>
        </li>
      </>
    );
  };

  const styleMenu = {
    left: menu ? 0 : "-50%",
  };

  return (
    <header>
      <ul style={styleMenu} className="menu-container">
        <div className="left-section">
          {isAdmin &&
            adminRouter(
              <div onClick={() => setMenu(!menu)}>
                <img src={menu} alt="" width="500" className="menu" />
              </div>
            )}
        </div>
        <ul style={styleMenu} className="middle-section">
          <li onMouseEnter={onEnter} onMouseLeave={onLeave}>
            <Link to="/">{"Trang chủ"}</Link>
          </li>
          <li onMouseEnter={onEnter} onMouseLeave={onLeave}>
            <Link to="/products">{isAdmin ? "Cửa hàng" : "Cửa hàng"}</Link>
          </li>
        </ul>

        <div
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          className="right-section "
        >
          {!isAdmin && <Link to="/create_product">Đăng tin</Link>}
        </div>
      </ul>
    </header>
  );
}
//comments

export default Header;
