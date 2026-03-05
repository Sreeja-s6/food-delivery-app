import React, { useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from "axios"
import { toast } from "react-toastify"

function Add() {

    const url = import.meta.env.VITE_API_URL
    const [image, setImage] = useState(false)
    const [submitting, setSubmitting] = useState(false) // ✅ loading state

    const [data, setData] = useState({
        name: "",
        description: "",
        price: "",
        category: "Salad"
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(prev => ({ ...prev, [name]: value }))
    }

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if (!image) {
            toast.error("Please upload an image");
            return;
        }

        setSubmitting(true); // ✅ show loading immediately

        // ✅ Show uploading toast immediately
        const loadingToast = toast.loading("Uploading food item...");

        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("price", Number(data.price));
            formData.append("category", data.category);
            formData.append("image", image);

            const response = await axios.post(
                `${url}/api/food`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            if (response.data) {
                // ✅ Update loading toast to success
                toast.update(loadingToast, {
                    render: "Food added successfully! 🎉",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000
                });

                setData({
                    name: "",
                    description: "",
                    price: "",
                    category: "Salad"
                });
                setImage(false);
            }

        } catch (error) {
            console.error(error);
            // ✅ Update loading toast to error
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Failed to add food",
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
        } finally {
            setSubmitting(false); // ✅ reset loading
        }
    }

    return (
        <div className='add'>
            <form className='flex-col' onSubmit={onSubmitHandler}>

                {/* Image Upload */}
                <div className="add-img-upload flex-col">
                    <p>Upload Image</p>
                    <label htmlFor="image">
                        <img
                            src={image ? URL.createObjectURL(image) : assets.upload_area}
                            alt="upload"
                        />
                    </label>
                    <input
                        onChange={(e) => setImage(e.target.files[0])}
                        type="file"
                        id='image'
                        hidden
                        required
                    />
                </div>

                {/* Name */}
                <div className="add-product-name flex-col">
                    <p>Name</p>
                    <input
                        onChange={onChangeHandler}
                        value={data.name}
                        type="text"
                        name='name'
                        placeholder='Type here'
                        required
                    />
                </div>

                {/* Description */}
                <div className="add-product-description flex-col">
                    <p>Description</p>
                    <textarea
                        onChange={onChangeHandler}
                        value={data.description}
                        name="description"
                        rows="6"
                        placeholder='Write content here'
                        required
                    />
                </div>

                {/* Category & Price */}
                <div className="add-category-price">
                    <div className="add-category flex-col">
                        <p>Category</p>
                        <select onChange={onChangeHandler} name="category" value={data.category}>
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

                    <div className="add-price flex-col">
                        <p>Price</p>
                        <input
                            onChange={onChangeHandler}
                            value={data.price}
                            type="number"
                            name='price'
                            placeholder='Enter price'
                            required
                        />
                    </div>
                </div>

                {/* ✅ Button shows loading state */}
                <button
                    type='submit'
                    className='add-btn'
                    disabled={submitting}
                    style={{ opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
                >
                    {submitting ? "Uploading..." : "ADD"}
                </button>

            </form>
        </div>
    )
}

export default Add