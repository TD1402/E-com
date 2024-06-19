import React, { useContext, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import ProductItem from "../utils/productItem/ProductItem";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Feedback from "./Feedback";
import axios from "axios";
import FeedbackItem from "./FeedbackItem";
import Rating from "react-rating";
import gsap from "gsap";
import API_URL from "../../../api/baseAPI";

function DetailProduct() {
  const params = useParams();
  const state = useContext(GlobalState);
  const [products] = state.productsAPI.products;
  const addCart = state.userAPI.addCart;
  const [detailProduct, setDetailProduct] = useState([]);
  const [type, setType] = useState();
  const [feedback, setFeedback] = useState([]);
  const [result, setResult] = useState(0);
  const [isLogged] = useState(false);
  const user_id = state.userAPI.userID[0];
  const [total, setTotal] = useState(0);
  const [score, setScore] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (params.id) {
      products.forEach((product) => {
        if (product._id === params.id) {
          setDetailProduct(product);
          setType(product.types[0]);
        }
      });
    }
  }, [params.id, products]);

  useEffect(() => {
    if (params.id) {
      const getFeedback = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/products/${params.id}`);
          setFeedback(res.data.feedbacks);
        } catch (err) {
          alert(err.response.data.msg);
        }
      };
      getFeedback();
    }
  }, [params.id]);

  useEffect(() => {
    if (feedback.length) {
      var total = 0;
      feedback.forEach((item) => {
        total += item.rating;
      });
      setResult(total / feedback.length);
    }
  }, [feedback]);

  const handleAddItem = () => {
    if (isLogged) {
      alert("Vui lòng đăng nhập");
    } else {
      addCart(detailProduct, type);
    }
  };

  useEffect(() => {
    setTotal(total);
  }, [total]);

  useEffect(() => {
    feedback.forEach((item) => {
      setScore(item.rating);
    });
  }, [feedback]);

  const onLeave = ({ currentTarget }) => {
    gsap.to(currentTarget, { scale: 1 });
  };

  if (detailProduct.length === 0) return null;

  const checktype = (event) => {
    const id = event.target.value;
    const types = detailProduct.types;
    const type2 = types.filter((t) => t._id === id);
    setType(type2[0]);
  };

  const colors = {
    orange: "#FFA500",
    grey: "#808080",
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? detailProduct.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === detailProduct.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <>
      <div className="detail">
        <div className="image-container" style={{ position: "relative" }}>
          {detailProduct.images.length > 1 && (
            <>
              <FaChevronLeft
                className="prev-btn"
                onClick={handlePrevImage}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "0",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              />
              <FaChevronRight
                className="next-btn"
                onClick={handleNextImage}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "0",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                }}
              />
            </>
          )}
          <img
            onMouseLeave={onLeave}
            src={detailProduct.images[currentImageIndex].url}
            alt=""
          />
          {detailProduct.images.length > 1 && (
            <>
              <div
                className="dot-container"
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: "5px",
                }}
              >
                {detailProduct.images.map((image, index) => (
                  <div
                    key={index}
                    className="dot"
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: index === currentImageIndex ? "blue" : "gray",
                      cursor: "pointer",
                    }}
                    onClick={() => handleDotClick(index)}
                  ></div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="box-detail">
          <div className="row">
            <h3>{detailProduct.title}</h3>
          </div>
          <p>
            <Rating
              initialRating={result}
              emptySymbol={<FaStar color={colors.grey} className="icon" />}
              fullSymbol={<FaStar color={colors.orange} className="icon" />}
              readonly
            />
            &nbsp;{feedback.length} Đánh giá
          </p>
          <div className="underline"></div>
          <br />
          <span className="span-detail">
            {type?.price.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}{" "}
          </span>
          &nbsp;&nbsp;&nbsp;&nbsp;Số lượng:{" "}
          <span className="span-detail">{type?.amount}</span>
          <p>
            {detailProduct.description.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </p>
          <label htmlFor="types">Loại:</label>
          <select onChange={checktype} name="type" id="type">
            {detailProduct.types.map((type) => (
              <option key={type._id} value={type._id}>
                {type.name}
              </option>
            ))}
          </select>
          <>
            {detailProduct.user_cre !== user_id && (
              <Link
                to={`/detail/${detailProduct._id}`}
                className="cart"
                onClick={handleAddItem}
              >
                Thêm vào giỏ hàng
              </Link>
            )}
          </>
        </div>
      </div>
      <br />
      <div className="description-detail"></div>
      {feedback.length > 0 && <Feedback feedback={feedback} />}
      <br />
      <div className="product-info-tabs">
        <div className="header-feedback">
          <h3> Đánh giá sản phẩm ({feedback.length})</h3>
          <div className="underline2"></div>
        </div>
        <div className="feedback-item">
          {feedback.map((feedbacks) => {
            return <FeedbackItem key={feedbacks._id} feedbacks={feedbacks} />;
          })}
        </div>
        <br />
      </div>
      <br />
      <div>
        <h2 className="h2">Sản phẩm liên quan</h2>
        <div className="products">
          {products.map((product) => {
            return product.category === detailProduct.category ? (
              <ProductItem key={product._id} product={product} />
            ) : null;
          })}
        </div>
      </div>
    </>
  );
}

export default DetailProduct;
