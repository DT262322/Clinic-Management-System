import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import '../css/ProductDetail.css';
import ProductService from "../../service/ProductService";
import BrandService from "../../service/BrandService";
import CategoryService from "../../service/CategoryService";
import CartService from "../../service/CartService";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [brandName, setBrandName] = useState('');
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        fetchProductDetail();
    }, [id]);

    const fetchProductDetail = async () => {
        try {
            const res = await ProductService.getProductByID(id)
            setProduct(res.data);

            // Fetch brand name
            const brandRes = await BrandService.getBrandById(res.data.brandId);
            setBrandName(brandRes.data.name);

            // Fetch category name
            const categoryRes = await CategoryService.getCategoryById(res.data.categoryId)
            setCategoryName(categoryRes.data.name);

        } catch (error) {
            console.error("Error fetching product details:", error);
            setError("Failed to load product details. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (buyNow = false) => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (!userId || !token) {
            toast.warn('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.');
            navigate('/login');
            return;
        }

        try {
            await CartService.createCart(userId, product.id, quantity);
            toast.success('Sản phẩm đã được thêm vào giỏ hàng thành công!');
            if (buyNow) {
                navigate('/cart');
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
            toast.error('Đã có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
        }
    };

    if (loading) return <div>Loading product details...</div>;
    if (error) return <div>{error}</div>;
    if (!product) return <div>Product not found.</div>;

    return (
        <div className="product-detail-container">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            <div className="product-images">
                <img src={`https://project-sem3-2024.s3.ap-southeast-1.amazonaws.com/${product.imageName}`}
                    alt={product.name} className="main-image" />
            </div>
            <div className="product-info">
                <h1>{product.name}</h1>
                <p className="product-code">P28033 • Thương hiệu: {brandName}</p>
                <p className="product-category">Danh mục: {categoryName}</p>
                <p className="product-price">{product.price.toLocaleString()} đ/Hộp</p>
                <p className="product-tax-info">Giá đã bao gồm thuế. Phí vận chuyển và các chi phí khác (nếu có) sẽ được
                    thể hiện khi đặt hàng.</p>
                <div className="product-rating">
                    <span className="heart-icon">♥</span>
                    <span>16.6k</span>
                    <span>Đã bán 1.8k</span>
                </div>
                <div className="product-variant">
                    <h3>Phân loại sản phẩm</h3>
                    <button className="variant-button">Hộp</button>
                </div>
                <div className="promotion-tag">Khuyến mãi</div>
                <div className="promotion-info">
                    <span className="gift-icon">🎁</span>
                    Mua 1 Tặng 1 lọ đèn Bioamicus - (01-30/9)
                </div>
                <div className="quantity-selector">
                    <span>Số lượng</span>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}
                        min="1" />
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
                <div className="action-buttons">
                    <Button label="Mua ngay" className="buy-now-button" onClick={() => handleAddToCart(true)}/>
                    <Button label="Thêm vào giỏ" className="add-to-cart-button" onClick={() => handleAddToCart(false)} />
                </div>
                <div className="product-features">
                    <div className="feature">
                        <span className="feature-icon">💊</span>
                        <span>Đủ thuốc chuẩn</span>
                    </div>
                    <div className="feature">
                        <span className="feature-icon">🚚</span>
                        <span>Giao hàng siêu tốc</span>
                    </div>
                    <div className="feature">
                        <span className="feature-icon">💰</span>
                        <span>Miễn phí vận chuyển</span>
                    </div>
                </div>
                <div className="product-details">
                    <div className="detail-item">
                        <span className="detail-label">Danh mục</span>
                        <span className="detail-value">{categoryName}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Công dụng</span>
                        <span className="detail-value">
                            {showFullDescription ? product.description : `${product.description.slice(0, 100)}... `}
                            <button onClick={() => setShowFullDescription(!showFullDescription)}>
                                {showFullDescription ? 'Đọc ít hơn' : 'Đọc thêm'}
                            </button>
                        </span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Quy cách</span>
                        <span className="detail-value">Hộp 20 gói</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Lưu ý</span>
                        <span className="detail-value">Sản phẩm này không phải là thuốc, không có tác dụng thay thế thuốc chữa bệnh. Đọc kỹ tờ hướng dẫn sử dụng trước khi dùng.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
