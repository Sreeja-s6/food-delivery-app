import React, { useEffect, useState } from 'react'
import './List.css'
import axios from "axios"
import { toast } from "react-toastify"

const List = () => {

  const url = import.meta.env.VITE_API_URL
  const [list, setList] = useState([]);

  // EDIT MODAL STATE
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    category: ""
  });
  const [editImage, setEditImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // FETCH ALL FOOD
  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food`);
      setList(response.data);
    } catch (error) {
      toast.error("Error fetching food list");
    }
  }

  // DELETE FOOD
  const removeFood = async (foodId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${url}/api/food/${foodId}`, {
        headers: { Authorization: `Bearer ${token}` }
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

  // OPEN EDIT MODAL
  const openEdit = (item) => {
    setEditData({
      id: item._id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category
    });
    setEditImage(null);
    setShowModal(true);
  };

  // HANDLE EDIT INPUT CHANGE
  const onEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  // SUBMIT EDIT
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", editData.name);
      formData.append("description", editData.description);
      formData.append("price", Number(editData.price));
      formData.append("category", editData.category);
      if (editImage) {
        formData.append("image", editImage);
      }

      const response = await axios.put(
        `${url}/api/food/${editData.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (response.data) {
        toast.success("Food updated successfully!");
        setShowModal(false);
        fetchList();
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating food");
    } finally {
      setLoading(false);
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

        {list.map((item, index) => (
          <div key={index} className='list-table-format'>
            <img src={`${url}/uploads/${item.image}`} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>₹{item.price}</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => openEdit(item)}
                style={{
                  background: "#f5a623",
                  color: "white",
                  border: "none",
                  padding: "4px 10px",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Edit
              </button>
              <button
                onClick={() => removeFood(item._id)}
                style={{
                  background: "#e74c3c",
                  color: "white",
                  border: "none",
                  padding: "4px 10px",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100%", height: "100%",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            padding: "30px",
            borderRadius: "10px",
            width: "450px",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <h2 style={{ marginBottom: "20px" }}>Edit Food Item</h2>

            <form onSubmit={handleEditSubmit}>

              {/* Name */}
              <div style={{ marginBottom: "15px" }}>
                <p style={{ marginBottom: "5px", fontWeight: "600" }}>Name</p>
                <input
                  name="name"
                  value={editData.name}
                  onChange={onEditChange}
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: "15px" }}>
                <p style={{ marginBottom: "5px", fontWeight: "600" }}>Description</p>
                <textarea
                  name="description"
                  value={editData.description}
                  onChange={onEditChange}
                  rows="3"
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>

              {/* Price */}
              <div style={{ marginBottom: "15px" }}>
                <p style={{ marginBottom: "5px", fontWeight: "600" }}>Price</p>
                <input
                  name="price"
                  type="number"
                  value={editData.price}
                  onChange={onEditChange}
                  required
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
              </div>

              {/* Category */}
              <div style={{ marginBottom: "15px" }}>
                <p style={{ marginBottom: "5px", fontWeight: "600" }}>Category</p>
                <select
                  name="category"
                  value={editData.category}
                  onChange={onEditChange}
                  style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                >
                  <option value="Salad">Salad</option>
                  <option value="Rolls">Rolls</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Sandwich">Sandwich</option>
                  <option value="Cake">Cake</option>
                  <option value="Pure Veg">Pure Veg</option>
                  <option value="Pasta">Pasta</option>
                  <option value="Noodles">Noodles</option>
                </select>
              </div>

              {/* Image */}
              <div style={{ marginBottom: "20px" }}>
                <p style={{ marginBottom: "5px", fontWeight: "600" }}>
                  Image <span style={{ color: "#999", fontSize: "12px" }}>(leave empty to keep existing)</span>
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditImage(e.target.files[0])}
                  style={{ width: "100%" }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                    background: "white"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "8px 20px",
                    borderRadius: "4px",
                    border: "none",
                    background: "#f5a623",
                    color: "white",
                    cursor: "pointer"
                  }}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default List