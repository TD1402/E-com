import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";

const ItemCorrect = ({ item: initialItem }) => {
  const state = useContext(GlobalState);
  const [item, setItem] = useState(initialItem);
  const [token] = state.token;
  useEffect(() => {
    setItem(initialItem);
  }, [initialItem]);

  return (
    <tr key={item._id}>
      <td>{item._id}</td>
      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
      <td>{item.address}</td>
      <td>{item.phone}</td>
      <td>
        {item.status === "Pending"
          ? "Đang xử lý thanh toán"
          : item.status === "Paid"
          ? "Đã thanh toán"
          : item.status}
      </td>
      <td>
        <button type="button">
          <img
            className="img-correct"
            src={
              item.delivery === "Confirmed"
                ? "https://cdn-icons-png.flaticon.com/128/8888/8888205.png"
                : "https://cdn-icons-png.flaticon.com/128/7698/7698976.png"
            }
            alt="Confirm Delivery"
          />
        </button>
      </td>
      <td>
        <Link to={`/history/${item._id}`}>Xem</Link>
      </td>
    </tr>
  );
};

export default ItemCorrect;
