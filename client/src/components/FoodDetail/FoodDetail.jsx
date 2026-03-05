import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosInstance from '../../api/axiosInstance'
import { StoreContext } from '../../context/StoreContext'
import './FoodDetail.css'

function FoodDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { cartItems, addToCart, decreaseQuantity } = useContext(StoreContext)
    const [food, setFood] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFood = async () => {
            try {
                const res = await axiosInstance.get(`/api/food/${id}`)
                setFood(res.data)
            } catch (error) {
                console.log(error)
                navigate('/')
            } finally {
                setLoading(false)
            }
        }
        fetchFood()
    }, [id])

    if (loading) return <div className="fd-loading">Loading...</div>
    if (!food) return <div className="fd-loading">Food not found</div>

    return (
        <div className='food-detail'>
            <button className='fd-back' onClick={() => navigate(-1)}>← Back</button>

            <div className='fd-container'>
                <img src={food.image} alt={food.name} className='fd-image' />

                <div className='fd-info'>
                    <h1>{food.name}</h1>
                    <p className='fd-category'>Category: {food.category}</p>
                    <p className='fd-desc'>{food.description}</p>
                    <p className='fd-price'>₹{food.price}</p>

                    <div className='fd-actions'>
                        {!cartItems[id] ? (
                            <button className='fd-add-btn' onClick={() => addToCart(id)}>
                                Add to Cart
                            </button>
                        ) : (
                            <div className='fd-counter'>
                                <button onClick={() => decreaseQuantity(id)}>−</button>
                                <span>{cartItems[id]}</span>
                                <button onClick={() => addToCart(id)}>+</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FoodDetail