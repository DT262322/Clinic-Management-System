import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Cart.css';
import CartService from "../../service/CartService";
import OrderService from '../../service/OrderService';
import PaymentService from '../../service/PaymentService';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    useEffect(() => {
        console.log('userId from localStorage:', userId);
    }, [userId]);

    const fetchCartItems = useCallback(async () => {
        console.log('Fetching cart items for userId:', userId);

        if (!userId) {
            console.log('No userId found, redirecting to login');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const response = await CartService.getCartByUserId(userId, token);
            console.log('Cart data received:', response.data);
            setCartItems(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching cart:', err);
            setError('Không thể tải giỏ hàng. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }, [userId, token, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchCartItems();
        };

        fetchData();
    }, [fetchCartItems]);

    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            await CartService.updateQuantityCart(userId, productId, newQuantity, token);
            await fetchCartItems();
        } catch (err) {
            setError('Không thể cập nhật số lượng. Vui lòng thử lại.');
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await CartService.deleteCart(userId, productId, token);
            await fetchCartItems();
        } catch (err) {
            setError('Không thể xóa sản phẩm. Vui lòng thử lại.');
        }
    };

    const calculateTotal = useCallback(() => {
        return cartItems.reduce((total, item) => {
            return total + (item.unitPrice || 0) * (item.quantity || 0);
        }, 0);
    }, [cartItems]);

    const handleCheckout = async () => {
        var listCart = [];
        cartItems.forEach(item => listCart.push(item.id));
        console.log(listCart);

        const res = await OrderService.createOrder(listCart, userId);
        console.log(res.data);
        console.log(res.data.id);

        const paymentDTO = {
            OrderType: "ATM",
            Amount: res.data.total,
            OrderDescription: "test desciption",
            Name: `${res.data.id}`
        };
        const response = await PaymentService.createPaymentUrl(paymentDTO);
        console.log(response.data);

        window.location.href = response.data;
    };

    const handleViewOrderHistory = () => {
        navigate('/order-history');
    };
    

    if (loading) return <div className="loading">Đang tải...</div>;

    return (
        <div className="cart-container">
            <h1 className="cart-title">Giỏ hàng của bạn</h1>
            <button className="view-order-history-btn" onClick={handleViewOrderHistory}>
                Xem lịch sử đơn hàng
            </button>
            <div className="cart-content">
                {error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <>
                        <table className="cart-table">
                            <thead>
                                <tr>
                                    <th>Sản phẩm</th>
                                    <th>Giá</th>
                                    <th>Số lượng</th>
                                    <th>Tổng</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="empty-cart-message">Chưa có sản phẩm trong giỏ hàng</td>
                                    </tr>
                                ) : (
                                    cartItems.map((item) => (
                                        <tr key={item.productId} className="cart-item">
                                            <td>
                                                <div className="item-info">
                                                    {item.product?.imageUrl ? (
                                                        <img src={item.product.imageUrl} alt={item.product.name || 'Sản phẩm'} />
                                                    ) : (
                                                        <div className="no-image">Không có hình ảnh</div>
                                                    )}
                                                    <span>{item.product?.name || 'Sản phẩm không xác định'}</span>
                                                </div>
                                            </td>
                                            <td>{item.unitPrice?.toLocaleString('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                            }) || 'N/A'}</td>
                                            <td>
                                                <div className="quantity-controls">
                                                    <button
                                                        onClick={() => handleQuantityChange(item.productId, (item.quantity || 0) - 1)}
                                                        disabled={item.quantity <= 1}>-
                                                    </button>
                                                    <span>{item.quantity || 0}</span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item.productId, (item.quantity || 0) + 1)}>+
                                                    </button>
                                                </div>
                                            </td>
                                            <td>
                                                {((item.unitPrice || 0) * (item.quantity || 0)).toLocaleString('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                })}
                                            </td>
                                            <td>
                                                <button className="remove-item"
                                                    onClick={() => handleRemoveItem(item.productId)}>Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        <div className="cart-summary">
                            <div className="cart-total">
                                <h2>Tổng cộng: {calculateTotal().toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                })}</h2>
                            </div>
                            <div className="cart-actions">
                                {cartItems.length > 0 && (
                                    <button className="checkout-btn" onClick={handleCheckout}>
                                        Tiến hành thanh toán
                                    </button>
                                )}

                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Cart;