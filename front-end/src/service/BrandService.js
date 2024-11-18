import axios from "axios";

const getAllBrands = () => {
    return axios.get("/Brands");
}
const getBrandById =(id) =>{
    return axios.get(`/Brands/${id}`);
}

const BrandService = {
    getAllBrands,
    getBrandById
};

export default BrandService;