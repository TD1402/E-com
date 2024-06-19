import "./topheader.css";
import { Link } from "react-router-dom";
import React, { useContext } from "react";
import { GlobalState } from "../../GlobalState";
import Logo from "./icon/logochocu.jpg";
import classNames from "classnames/bind";
import styles from "./Topheader.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { BsCart3 } from "react-icons/bs";
import { AiOutlineHistory } from "react-icons/ai";
import { BiUser } from "react-icons/bi";
import { HiOutlineLogout } from "react-icons/hi";
import axios from "axios";
import { gsap } from "gsap";
import API_URL from "../../api/baseAPI";

const cx = classNames.bind(styles);

export const TopHeader = () => {
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  const [isAdmin] = state.userAPI.isAdmin;
  const [cart] = state.userAPI.cart;
  const [user] = state.userAPI.detail;

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

  const loggedRouter = () => {
    return (
      <div className={cx("row2-topheader")}>
        <p className={cx("userName_label")}>{user?.name} </p>
        <ul className={cx("list-topheader")}>
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
        </ul>
      </div>
    );
  };

  return (
    <>
      <div className="header-container-top">
        <div className="logo">
          <img src={Logo} alt="PetFirst" />
        </div>
        <div className="top-header-right">
          <button className={cx("login-btn")}>
            {isLogged ? (
              loggedRouter()
            ) : (
              <p onMouseEnter={onEnter} onMouseLeave={onLeave}>
                <Link to="/login">
                  <FontAwesomeIcon icon={faSignOut} />
                  <span className={cx("label")}>Đăng nhập</span>
                </Link>
              </p>
            )}
          </button>
          {isAdmin ? (
            ""
          ) : (
            <div className="cart-icon">
              <span>{cart.length}</span>
              <Link to="/cart">
                <BsCart3 />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
