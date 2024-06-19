import { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from './baseAPI';
function TypeApi() {
  const [types, setTypes] = useState([]);

  const getTypes = async () => {
    const res = await axios.get(`${API_URL}/api/type`);
    setTypes(res.data);
  };
  useEffect(() => {
    getTypes();
  }, []);
  return {
    type: [types, setTypes],
  };
}

export default TypeApi;
