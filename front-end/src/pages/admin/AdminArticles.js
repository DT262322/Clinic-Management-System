import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast'; 
import '../css/AdminArticles.css';
import ArticleService from "../../service/ArticleService";

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const [expandedArticle, setExpandedArticle] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);
    const [newArticle, setNewArticle] = useState({ title: '', content: '', image: '', summary: '', status: false });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const statusOptions = [
        { label: 'Hoạt động', value: true },
        { label: 'Không hoạt động', value: false }
    ];
    const toastRef = React.createRef();

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = () => {
        ArticleService.getAllArticlesAdmin()
            .then((res) => {
                const updatedArticles = res.data.map(article => ({
                    ...article,
                    status: article.status
                }));
                setArticles(updatedArticles);
            })
            .catch((error) => console.error("Error fetching articles", error));
    };

    const toggleArticle = (index) => {
        setExpandedArticle(expandedArticle === index ? null : index);
    };

    const createArticle = async () => {
        const articleData = {
            title: newArticle.title,
            summary: newArticle.summary,
            content: newArticle.content,
            status: newArticle.status,
        };

        try {
            const response = await ArticleService.saveArticleAdmin(articleData);
            if (selectedImage) {
                const articleId = response.data.id;
                await uploadImage(selectedImage, articleId);
            }
            fetchArticles();
            toastRef.current.show({ severity: 'success', summary: 'Thành công', detail: 'Tạo bài viết thành công!', life: 3000 });
            setDialogVisible(false);
            resetNewArticle();
        } catch (error) {
            console.error("Error creating article", error);
            toastRef.current.show({ severity: 'error', summary: 'Thất bại', detail: 'Không thể tạo bài viết!', life: 3000 });
        }
    };

    const updateArticle = async () => {
        if (editingArticle && editingArticle.id) {
            const articleData = {
                id: editingArticle.id,
                title: editingArticle.title,
                summary: editingArticle.summary,
                content: editingArticle.content,
                imageName: editingArticle.image,
                status: editingArticle.status
            };

            try {
                await ArticleService.updateArticleAdmin(editingArticle.id, articleData);
                if (selectedImage) {
                    await uploadImage(selectedImage, editingArticle.id);
                }
                fetchArticles();
                toastRef.current.show({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật bài viết thành công!', life: 3000 });
                setDialogVisible(false);
                setEditingArticle(null);
            } catch (error) {
                console.error("Error updating article", error);
                toastRef.current.show({ severity: 'error', summary: 'Thất bại', detail: 'Không thể cập nhật bài viết!', life: 3000 });
            }
        } else {
            alert("No valid article ID to update.");
        }
    };

    const deleteArticle = (id) => {
        ArticleService.deleteArticleAdmin(id)
            .then(() => {
                fetchArticles();
                toastRef.current.show({ severity: 'success', summary: 'Thành công', detail: 'Xóa bài viết thành công!', life: 3000 });
            })
            .catch((error) => console.error("Error deleting article", error));
    };

    const openCreateDialog = () => {
        setEditingArticle(null);
        resetNewArticle();
        setDialogVisible(true);
    };

    const openEditDialog = (article) => {
        setEditingArticle({
            id: article.id,
            title: article.title,
            content: article.content,
            image: article.image,
            summary: article.summary,
            status: article.status
        });
        setDialogVisible(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                console.error('Invalid file type. Please upload an image (jpg, png, gif, webp).');
                setSelectedImage(null);
                return;
            }
            setSelectedImage(file);
        } else {
            console.error('No file selected.');
            setSelectedImage(null);
        }
    };

    const uploadImage = async (file, articleId) => {
        if (!file) {
            console.error('No file to upload.');
            return;
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            console.error('Invalid file type. Please upload an image (jpg, png, gif, webp).');
            return;
        }

        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_FILE_SIZE) {
            console.error('File is too large. Maximum size allowed is 5MB.');
            return;
        }

        const formData = new FormData();
        formData.append('imageFile', file);

        try {
            const response = await ArticleService.uploadArticleImageAdmin(articleId, formData);
            const imageUrl = response.data.imageName;
            setEditingArticle({
                ...editingArticle,
                image: imageUrl
            });
            return imageUrl;
        } catch (error) {
            console.error('Error uploading image:', error.response?.data?.message || error.message);
        }
    };

    const resetNewArticle = () => {
        setNewArticle({ title: '', content: '', image: '', summary: '', status: false });
        setSelectedImage(null); // Reset selected image when creating a new article
    };

    const filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="articles-container">
            <Toast ref={toastRef} />
            <h1 className="articles-title">Bài viết</h1>
            <Button label="Thêm mới" onClick={openCreateDialog} className="p-button-info" />
            <div className="search-container">
                <InputText
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm thông tin..."
                />
            </div>
            <div className="articles-list">
                {filteredArticles.map((article, index) => (
                    <Card key={article.id} onClick={() => toggleArticle(index)} className="article-card">
                        <h3>{article.title}</h3>
                        {expandedArticle === index && (
                            <div>
                                <p>{article.summary}</p>
                                <p><strong>Status:</strong> {article.status ? 'Hoạt động' : 'Không hoạt động'}</p>
                                <Button label="Chính sửa" onClick={() => openEditDialog(article)} className="p-button-success" style={{ padding: '0.5rem 1rem' }} />
                                <Button label="Xóa" onClick={() => deleteArticle(article.id)} className="p-button-danger" style={{ padding: '0.5rem 1rem' }} />
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            <Dialog visible={dialogVisible} onHide={() => setDialogVisible(false)} className="article-dialog">
                <h2>{editingArticle ? 'Chỉnh Sửa Bài Viết' : 'Thêm Bài Viết'}</h2>
                <div className="p-field">
                    <label htmlFor="title">Tiêu đề</label>
                    <InputText id="title" value={editingArticle ? editingArticle.title : newArticle.title} onChange={(e) => editingArticle ? setEditingArticle({ ...editingArticle, title: e.target.value }) : setNewArticle({ ...newArticle, title: e.target.value })} />
                </div>
                <div className="p-field">
                    <label htmlFor="summary">Tóm tắt</label>
                    <InputTextarea id="summary" rows={3} value={editingArticle ? editingArticle.summary : newArticle.summary} onChange={(e) => editingArticle ? setEditingArticle({ ...editingArticle, summary: e.target.value }) : setNewArticle({ ...newArticle, summary: e.target.value })} />
                </div>
                <div className="p-field">
                    <label htmlFor="content">Nội dung</label>
                    <InputTextarea id="content" rows={5} value={editingArticle ? editingArticle.content : newArticle.content} onChange={(e) => editingArticle ? setEditingArticle({ ...editingArticle, content: e.target.value }) : setNewArticle({ ...newArticle, content: e.target.value })} />
                </div>
                <div className="p-field">
                    <label htmlFor="image">Chọn ảnh</label>
                    <input type="file" id="image" onChange={handleImageChange} />
                </div>
                <div className="p-field">
                    <label htmlFor="status">Trạng thái</label>
                    <Dropdown id="status" options={statusOptions} value={editingArticle ? editingArticle.status : newArticle.status} onChange={(e) => editingArticle ? setEditingArticle({ ...editingArticle, status: e.value }) : setNewArticle({ ...newArticle, status: e.value })} />
                </div>
                <div className="dialog-footer">
                    <Button label="Cancel" icon="pi pi-times" onClick={() => setDialogVisible(false)} className="p-button-text" />
                    <Button label={editingArticle ? "Cập nhật" : "Thêm mới"} onClick={editingArticle ? updateArticle : createArticle} />
                </div>
            </Dialog>
        </div>
    );
};

export default Articles;
