import React, { useContext, useState, useEffect } from "react";
import BtnRender from "./BtnRender";
import { Link } from "react-router-dom";
import { GlobalState } from "../../../../GlobalState";
import { gsap } from "gsap";
import "./productItem.css";

function ProductItem({ product, isAdmin, deleteProduct, handleCheck }) {
  const state = useContext(GlobalState);
  const [categoriesName] = state.categoriesAPI.categories;
  //console.log(state.categoriesAPI.categories)
  const [newCate, setNewCate] = useState("");
  useEffect(() => {
    categoriesName.forEach((item) => {
      //console.log(item);
      if (item._id === product?.category) {
        setNewCate(item.name);
      }
    });
  }, []);
  const onLeave = ({ currentTarget }) => {
    gsap.to(currentTarget, { scale: 1 });
  };
  return (
    <div onMouseLeave={onLeave} className="product_card">
      {isAdmin && (
        <input
          type="checkbox"
          checked={product?.checked}
          onChange={() => handleCheck(product?._id)}
        />
      )}

      <img src={product?.images[0]?.url} alt="" />

      <div className="product_box">
        <span>{newCate}</span>
        <h2 className="content animation">
          <Link to={`/detail/${product?._id}`}>{product?.title}</Link>
        </h2>
        <p>{product?.description}</p>
        <div className="price">
          {product?.types && product?.types.length > 0
            ? product?.types[0].amount === 0
              ? "Đã bán"
              : product?.types[0].price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })
            : "N/A"}
        </div>
      </div>

      <BtnRender product={product} deleteProduct={deleteProduct} />
    </div>
  );
}

export default ProductItem;
