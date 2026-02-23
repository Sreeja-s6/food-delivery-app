import React, { useEffect, useState } from 'react'
import './List.css'
import axios from "axios"
import { toast } from "react-toastify"

const List = () => {

  const url = import.meta.env.VITE_API_URL
  const [list, setList] = useState([]);

  // FETCH ALL FOOD
  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food`);
      setList(response.data); // backend directly returns foods array
    } catch (error) {
      toast.error("Error fetching food list");
    }
  }

  // DELETE FOOD
  const removeFood = async (foodId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.delete(`${url}/api/food/${foodId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.message) {
      toast.success(response.data.message);
      fetchList();
    } else {
      toast.error("Delete failed");
    }

  } catch (error) {
    console.error(error);
    toast.error("Error deleting food");
  }
};


  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>

      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {list.map((item,index) => (
          <div key={index} className='list-table-format'>
            <img src={`${url}/uploads/${item.image}`} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>₹{item.price}</p>
            <p onClick={() => removeFood(item._id)} className='cursor'>x</p>
          </div>
        ))}

      </div>
    </div>
  )
}

export default List
