import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "./baseAPI";

function ProductsAPI() {
  const [products, setProducts] = useState([]);
  const [productRole1, setProductRole1] = useState([]);
  const [productRole0, setProductRole0] = useState([]);
  const [callback, setCallback] = useState(false);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(0);

  useEffect(() => {
    const getProducts = async () => {
      const res = await axios.get(
        `${API_URL}/api/products?${category}&${sort}&title[regex]=${search}`
      );
      setProducts(res.data.products);
      setResult(res.data.result);
    };
    getProducts();

    const getProductRole1 = async () => {
      const res = await axios.get(
        `${API_URL}/api/products?${category}&${sort}&title[regex]=${search}&role=1`
      );
      // console.log('price' + JSON.stringify(res.data.products[0].types));
      // console.log(res.data.products.types.length);
      setProductRole1(res.data.products);
      setResult(res.data.result);
    };
    getProductRole1();

    const getProductRole0 = async () => {
      const res = await axios.get(
        `${API_URL}/api/products?${category}&${sort}&title[regex]=${search}&role=0`
      );
      // console.log('price' + JSON.stringify(res.data.products[0].types));
      // console.log(res.data.products.types.length);
      setProductRole0(res.data.products);
      setResult(res.data.result);
    };
    getProductRole0();
  }, [callback, category, sort, search, page]);

  return {
    products: [products, setProducts],
    productRole1: [productRole1, setProductRole1],
    productRole0: [productRole0, setProductRole0],
    callback: [callback, setCallback],
    category: [category, setCategory],
    sort: [sort, setSort],
    search: [search, setSearch],
    page: [page, setPage],
    result: [result, setResult],
  };
}

export default ProductsAPI;
