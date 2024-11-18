import axios from "axios";

// Admin
const getAllProductsAdmin = () => {
    return axios.get('/admin/Products')
}
const saveProductAdmin = (product) => {
    return axios.post('/admin/Products/add', product)
}
const deleteProductByCodeAdmin = (code) => {
    return axios.delete(`/admin/Products/delete/${code}`);
}
const editProductByCodeAdmin = (code, product) => {
    return axios.put(`/admin/Products/edit/${code}`, product);
}



// User


const getAllProducts = () => {
    return axios.get("/Products");
}
const getProductByID = (id) => {
    return axios.get(`/Products/detail/${id}`);
}
const getProductByCode = (code) => {
    return axios.get(`/Products/detail/${code}`, {
        headers: {
            'Accept': 'application/json'
        }
    });
}

const uploadImageProductByCode = (code, data) => {
    return axios.post(`/Products/upload-image/${code}`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

const getProductsCheap = () => {
    return axios.get('/Products/cheap');
}
const getProductByCategoryId = (id) => {
    return axios.get(`/Products/category/${id}`);
}

const getProductByBrandId = (brandId) => {
    return axios.get(`/Products/brand/${brandId}`);
}

const ProductService = {
    getAllProductsAdmin,
    editProductByCodeAdmin,
    getAllProducts,
    getProductByID,
    getProductByCode,
    deleteProductByCodeAdmin,
    saveProductAdmin,
    getProductByCategoryId,
    getProductByBrandId,
    getProductsCheap,
    uploadImageProductByCode
}

export default ProductService;
