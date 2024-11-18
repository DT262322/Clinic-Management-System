import axios from "axios";
// Admin

// User

const getAllCategories = () => {
    return axios.get('/Categories')
}

const getCategoryById = (id) => {
    return axios.get('/Categories/' + id)
}
const editCategory =(category) =>{
    return axios.put(`/Categories/${category.id}`, category)
}
const saveCategory =  (category) => {
    return axios.post(`/Categories`, category)
}
const deleteCategory =(id) =>{
    return axios.delete(`/Categories/${id}`)
}

const CategoryService = {
    getAllCategories,
    editCategory,
    saveCategory,
    deleteCategory,
    getCategoryById
}
export default CategoryService;

