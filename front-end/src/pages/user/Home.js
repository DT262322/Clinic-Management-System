import React, { useEffect, useState } from 'react';
import { Carousel } from 'primereact/carousel';
import '../css/Home.css';
import ProductService from "../../service/ProductService";

const Home = () => {
  const bannerItems = [
    {
      img: './img/banner1.png',
      alt: 'Banner 1',
      caption: 'Ưu đãi Viên Uống Thông Xoang - Mùa Mưa Thông Thoáng',
      subtext: 'Áp dụng từ 07/2024 - 09/2024',
    },
    {
      img: './img/banner2.png',
      alt: 'Banner 2',
      caption: 'Tặng Quà Tri Ân',
      subtext: 'Tặng Voucher 10.000đ',
    },
  ];

  const [brandProducts, setBrandProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [cheapProducts, setCheapProducts] = useState([]);

  useEffect(() => {
    fetchBrandProducts();
    fetchCategoryProducts();
    fetchCheapProducts();
  }, []);

  const fetchBrandProducts = async () => {
    const response = await ProductService.getProductByBrandId(32);
    console.log('Brand Products:', response.data);
    setBrandProducts(response.data);
  };

  const fetchCategoryProducts = async () => {
    const response = await ProductService.getProductByCategoryId(13);
    console.log('Category Products:', response.data);
    setCategoryProducts(response.data);
  };

  const fetchCheapProducts = async () => {
    const response = await ProductService.getProductsCheap();
    console.log('Cheap Products:', response.data);
    setCheapProducts(response.data);
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const productTemplate = (product) => {
    return (
      <div className="product-item">
        <img
          className="product-image"
          src={`https://project-sem3-2024.s3.ap-southeast-1.amazonaws.com/${product.imageName}`}
          alt={product.name}
        />
        <h5>{product.name}</h5>
        <div className="product-price">{formatPrice(product.price)}</div>
      </div>
    );
  };

  const bannerTemplate = (item) => {
    return (
      <div className="banner-slide">
        <img src={item.img} alt={item.alt} className="w-full" />
        <div className="banner-caption">
          <h2>{item.caption}</h2>
          <p>{item.subtext}</p>
        </div>
      </div>
    );
  };

  return (
    <div className='home-container'>
      <div className="banner-section">
        <Carousel value={bannerItems} itemTemplate={bannerTemplate} numVisible={1} numScroll={1} circular autoplayInterval={3000} />
      </div>

      <div className="features-section">
        <div className="feature-item">
          <i className="feature-icon pi pi-check-circle"></i>
          <h4>100% Thuốc Chính Hãng</h4>
          <p>Nguồn gốc rõ ràng</p>
        </div>
        <div className="feature-item">
          <i className="feature-icon pi pi-file"></i>
          <h4>Đủ thuốc theo toa</h4>
          <p>Thuốc điều trị, đặc trị</p>
        </div>
        <div className="feature-item">
          <i className="feature-icon pi pi-user"></i>
          <h4>Chuyên môn, tận tình</h4>
          <p>Dược sĩ giàu kinh nghiệm</p>
        </div>
        <div className="feature-item">
          <i className="feature-icon pi pi-refresh"></i>
          <h4>30 ngày đổi trả</h4>
          <p>Kể từ lúc mua hàng</p>
        </div>
        <div className="feature-item">
          <i className="feature-icon pi pi-truck"></i>
          <h4>Miễn phí vận chuyển</h4>
          <p>Theo chính sách giao hàng</p>
        </div>
      </div>

      <div className="products-section">
        <h2>Sản Phẩm bán chạy</h2>
        <Carousel value={brandProducts} itemTemplate={productTemplate} numVisible={3} numScroll={1} circular autoplayInterval={3000} />

        <h2>Sản Phẩm Thiết Bị Y Tế</h2>
        <Carousel value={categoryProducts} itemTemplate={productTemplate} numVisible={3} numScroll={1} circular autoplayInterval={3000} />

        <h2>Sản Phẩm Giá Rẻ Chất Lượng</h2>
        <Carousel value={cheapProducts} itemTemplate={productTemplate} numVisible={3} numScroll={1} circular autoplayInterval={3000} />
      </div>
    </div>
  );
};

export default Home;
