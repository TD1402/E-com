import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "./baseAPI";
function UserAPI(token) {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState([]);
  const [history, setHistory] = useState([]);
  const [detail, setDetail] = useState([]);
  const [userID, setUserID] = useState("");
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          const res = await axios.get(`${API_URL}/user/infor`, {
            headers: { Authorization: token },
          });
          setDetail(res.data);
          console.log(res.data);
          setUserID(res.data._id);
          setIsLogged(true);
          res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);
          setCart(res.data.cart);
        } catch (err) {
          alert(err.response.data.msg);
        }
      };

      getUser();
    }
  }, [token]);
  // console.log(token);
  const addCart = async (product, type) => {
    console.log(type.amount);
    if (!isLogged) return alert("Vui lòng đăng nhập để có thể mua hàng");
    if (type.amount === 0) return alert("Loại này không còn hàng");
    var newProduct = Object.assign({}, product);
    newProduct.types = [type];
    const check = cart.every((item) => {
      return item._id !== product._id;
    });
    //console.log("cart"+ newProduct.type);
    if (check) {
      setCart([...cart, { ...newProduct, quantity: 1 }]);
      await axios.patch(
        `${API_URL}/user/addcart`,
        { cart: [...cart, { ...newProduct, quantity: 1 }] },
        {
          headers: { Authorization: token },
        }
      );
      alert("Thêm sản phẩm vào giỏ hàng thành công");
    } else {
      alert("Sản phẩm này đã có sẵn trong giỏ hàng.");
    }
  };

  return {
    isLogged: [isLogged, setIsLogged],
    isAdmin: [isAdmin, setIsAdmin],
    cart: [cart, setCart],
    addCart: addCart,
    history: [history, setHistory],
    detail: [detail, setDetail],
    userID: [userID, setUserID],
    users: [users, setUsers],
  };
}

export default UserAPI;
