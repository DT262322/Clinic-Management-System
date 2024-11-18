import axios from "axios";


// Admin
const getAllArticlesAdmin = () => {
    return axios.get("/admin/Articles");
}
const saveArticleAdmin = (article) => {
    return axios.post('/admin/Articles/add', article);
}

const updateArticleAdmin = (id, article) => {
    return axios.put(`/admin/Articles/edit/${id}`, article);
}

const deleteArticleAdmin = (id) => {
    return axios.delete(`/admin/Articles/delete/${id}`);
}


// User
const getAllArticles = () => {
    return axios.get('/Articles')
}
// API upload hình ảnh cho bài viết
const uploadArticleImageAdmin = (id, formData) => {
    return axios.post(`/Articles/upload-image/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
};

const ArticleService = {
    getAllArticles,
    getAllArticlesAdmin,
    saveArticleAdmin,
    updateArticleAdmin,
    deleteArticleAdmin,
    uploadArticleImageAdmin
}
export default ArticleService;