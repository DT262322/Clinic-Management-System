import React, { useEffect, useState, useCallback } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/ProductList.css';
import ProductService from "../../service/ProductService";
import BrandService from "../../service/BrandService";
import CategoryService from "../../service/CategoryService";
import CartService from "../../service/CartService";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [filter, setFilter] = useState({ usage: 'all', price: 'all', category: 'all', brand: 'all', search: '' });
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = useCallback(async () => {
        try {
            const [productsRes, categoriesRes, brandsRes] = await Promise.all([
                ProductService.getAllProducts(),
                CategoryService.getAllCategories(),
                BrandService.getAllBrands()
            ]);
            setProducts(productsRes.data);
            setFilteredProducts(productsRes.data);
            setCategories(categoriesRes.data);
            setBrands(brandsRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load data. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        applyFilters();
    }, [products, filter]);

    const formatPrice = (price) => new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(price);

    const addToCart = async (product) => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (!userId || !token) {
            toast.warn('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.');
            navigate('/login');
            return;
        }
    
        try {
            await CartService.createCart(userId, product.id, 1);
            toast.success('Sản phẩm đã được thêm vào giỏ hàng thành công!');
        } catch (error) {
            console.error('Error adding product to cart:', error);
            toast.error('Đã có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
        }
    };

    const applyFilters = () => {
        const { usage, price, category, brand, search } = filter;
        let updatedProducts = products.filter(product => 
            (search === '' || product.name.toLowerCase().includes(search.toLowerCase())) &&
            (usage === 'all' || product.usage === usage) &&
            (category === 'all' || product.categoryId === category) &&
            (brand === 'all' || product.brandId === brand)
        );

        if (price !== 'all') {
            const priceRanges = {
                'under100': p => p < 100000,
                '100to300': p => p >= 100000 && p <= 300000,
                '300to500': p => p > 300000 && p <= 500000,
                'over500': p => p > 500000
            };
            updatedProducts = updatedProducts.filter(product => priceRanges[price](product.price));
        }

        setFilteredProducts(updatedProducts);
    };

    const renderProductItem = (product) => (
        <Link to={`/product/${product.id}`} className="product-link" key={product.id}>
            <div className="product-item">
                <img
                    className="product-image"
                    src={`https://project-sem3-2024.s3.ap-southeast-1.amazonaws.com/${product.imageName}`}
                    alt={product.name}
                />
                <div className="product-details">
                    <div className="product-name">{product.name}</div>
                    <div className="product-action">
                        <div className="product-price">{formatPrice(product.price)}</div>
                        <Button
                            icon="pi pi-shopping-cart"
                            disabled={product.status === '0'}
                            className="p-button-success"
                            onClick={(e) => {
                                e.preventDefault();
                                addToCart(product);
                            }}
                        />
                    </div>
                </div>
            </div>
        </Link>
    );

    if (loading) return <div>Loading products...</div>;

    return (
        <div className="card">
            <ToastContainer />
            <h2 className="text-center mb-4">Medicine</h2>
            <div className="product-layout">
                <div className="filter-container">
                    <h3>Bộ lọc nâng cao</h3>
                    <div className="filter-item">
                        <span>Tìm kiếm:</span>
                        <input
                            type="text"
                            value={filter.search}
                            onChange={(e) => setFilter({...filter, search: e.target.value})}
                            placeholder="Nhập tên sản phẩm"
                        />
                    </div>
                    <div className="filter-item">
                        <span>Giá bán:</span>
                        <Dropdown
                            value={filter.price}
                            options={[
                                {label: 'Tất cả', value: 'all'},
                                {label: 'Dưới 100.000đ', value: 'under100'},
                                {label: '100.000đ đến 300.000đ', value: '100to300'},
                                {label: '300.000đ đến 500.000đ', value: '300to500'},
                                {label: 'Trên 500.000đ', value: 'over500'},
                            ]}
                            onChange={(e) => setFilter({...filter, price: e.value})}
                        />
                    </div>
                    <div className="filter-item">
                        <span>Danh mục:</span>
                        <Dropdown
                            value={filter.category}
                            options={[
                                {label: 'Tất cả', value: 'all'},
                                ...categories.map(category => ({label: category.name, value: category.id})),
                            ]}
                            onChange={(e) => setFilter({...filter, category: e.value})}
                        />
                    </div>
                    <div className="filter-item">
                        <span>Hãng sản xuất:</span>
                        <Dropdown
                            value={filter.brand}
                            options={[
                                {label: 'Tất cả', value: 'all'},
                                ...brands.map(brand => ({label: brand.name, value: brand.id})),
                            ]}
                            onChange={(e) => setFilter({...filter, brand: e.value})}
                        />
                    </div>
                </div>

                <div className="product-list">
                    {filteredProducts.length > 0 
                        ? filteredProducts.map(renderProductItem)
                        : <div>No products found.</div>
                    }
                </div>
            </div>
        </div>
    );
}

export default ProductList;