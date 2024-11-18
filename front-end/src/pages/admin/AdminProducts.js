import React, {useState, useEffect, useRef} from 'react';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Toast} from 'primereact/toast';
import {Dropdown} from 'primereact/dropdown';
import {Calendar} from 'primereact/calendar';
import '../css/Modal.css';
import {Checkbox} from 'primereact/checkbox';
import ProductService from "../../service/ProductService";
import CategoryService from "../../service/CategoryService";
import BrandService from "../../service/BrandService";


function AdminProductsModal() {
    const [visible, setVisible] = useState(false);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isViewMode, setIsViewMode] = useState(false);
    const [toast] = useState(React.createRef());
    const [loading, setLoading] = useState(true);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10); // Số dòng trên mỗi trang
    const [selectedImage, setSelectedImage] = useState(null); // Thêm state cho ảnh
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchBrands();
    }, []);

    const fetchProducts = () => {
        setLoading(true);
        ProductService.getAllProductsAdmin()
            .then((res) => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching Products:', error);
                setLoading(false);
            });
    };

    const fetchCategories = () => {
        CategoryService.getAllCategories()
            .then((res) => setCategories(res.data))
            .catch((error) => console.error('Error fetching Categories:', error));
    };

    const fetchBrands = () => {
        BrandService.getAllBrands()
            .then((res) => setBrands(res.data))
            .catch((error) => console.error('Error fetching Brands:', error));
    };

    const openNew = () => {
        setSelectedProduct({});
        setIsViewMode(false);
        setVisible(true);
    };

    const editProduct = (product) => {
        setSelectedProduct({...product});
        setIsViewMode(false);
        setVisible(true);
    };

    const viewProduct = (product) => {
        setSelectedProduct({...product});
        setIsViewMode(true);
        setVisible(true);
    };

    const deleteProduct = (code) => {
        if (!code) {
            toast.current.show({severity: 'error', summary: 'Error', detail: 'Product code is required', life: 3000});
            return;
        }

        if (window.confirm(`Are you sure you want to delete product with code: ${code}?`)) {
            ProductService.deleteProductByCodeAdmin(code)
                .then(() => {
                    fetchProducts();
                    toast.current.show({
                        severity: 'success',
                        summary: 'Product Deleted',
                        detail: `Product code: ${code} has been deleted`,
                        life: 3000
                    });
                })
                .catch((error) => {
                    console.error('Error deleting product:', error);
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to delete product',
                        life: 3000
                    });
                });
        }
    };

    const saveProduct = () => {
        // Kiểm tra các trường hợp cần thiết
        if (!selectedProduct.name || selectedProduct.stock < 0 || selectedProduct.price < 0) {
            toast.current.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please fill all required fields and ensure stock and price are valid!',
                life: 3000
            });
            return;
        }

        if (selectedProduct.code) {
            editProductDetails(selectedProduct.code);
        } else {
            addProduct(selectedProduct);
        }
    };

    const addProduct = (product) => {
        // Chỉ gửi các trường cần thiết
        const {imageName, ...newProduct} = product;

        ProductService.saveProductAdmin(newProduct)
            .then(async (response) => {
                if (selectedImage) {
                    await uploadFile(selectedImage, response.data.code);
                }
                fetchProducts();
                setVisible(false);
                toast.current.show({
                    severity: 'success',
                    summary: 'Product Created',
                    detail: 'Product created successfully!',
                    life: 3000
                });
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.title || `Error creating product: ${error.message}`;
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorMessage,
                    life: 3000
                });
            });
    };

    const editProductDetails = (code) => {
        // Tạo bản sao của selectedProduct
        const {imageName, ...updatedProduct} = selectedProduct; // Tách imageName ra

        ProductService.editProductByCodeAdmin(code, selectedProduct)
            .then((response) => {
                if (selectedImage) {
                    uploadFile(selectedImage, code);
                }
                fetchProducts();
                setVisible(false);
                toast.current.show({
                    severity: 'success',
                    summary: 'Product Updated',
                    detail: 'Product updated successfully!',
                    life: 3000
                });
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.title || `Error updating product: ${error.message}`;
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: errorMessage,
                    life: 3000
                });
            });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                console.error('Invalid file type. Please upload an image (jpg, png, gif).');
                return;
            }
            setSelectedImage(file);
        } else {
            console.error('No file selected.');
        }
    };

    const uploadFile = async (file, productCode) => {
        if (!file) {
            console.error('No file to upload.');
            return;
        }

        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            console.error('Invalid file type. Please upload an image (jpg, png, gif).');
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
            const response = await ProductService.uploadImageProductByCode(productCode, formData);
            console.log('Upload success:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error uploading file:', error.response?.data?.message || error.message);
        }
    };


    const renderFormField = (label, id, type, value, onChange, disabled = false) => (
        <div className="p-field">
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                disabled={disabled || isViewMode}
                required={!isViewMode}
            />
        </div>
    );
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div>
            <Toast ref={toast}/>
            <Button label="Thêm sản phẩm" icon="pi pi-plus" onClick={openNew}/>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Tìm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-inputtext p-component"
                />
            </div>

            <DataTable
                value={filteredProducts}
                className="p-datatable-striped p-datatable-gridlines"
                paginator
                rows={rows}
                first={first}
                onPage={(e) => {
                    setFirst(e.first);
                    setRows(e.rows);
                }}
                loading={loading}
                rowsPerPageOptions={[5, 10, 20]} // Tùy chọn số dòng trên mỗi trang
            >
                <Column field="code" header="ID Sản phẩm" body={(rowData) => (
                    <span
                        className="clickable-code"
                        onClick={() => viewProduct(rowData)}
                        style={{cursor: 'pointer', color: '#2196F3'}}>
                        {rowData.code}
                    </span>
                )}/>
                <Column field="name" header="Sản phẩm"/>
                <Column field="stock" header="Kho"/>
                <Column field="price" header="Đơn giá"/>
                <Column field="categoryId" header="Danh mục" body={(rowData) => {
                    const category = categories.find(cat => cat.id === rowData.categoryId);
                    return category ? category.name : 'Unknown';
                }}/>
                <Column field="brandId" header="Nhãn hàng" body={(rowData) => {
                    const brand = brands.find(br => br.id === rowData.brandId);
                    return brand ? brand.name : 'Unknown';
                }}/>
                <Column
                    field="status"
                    header="Trạng thái"
                    body={(rowData) => (
                        <span className={`status-badge status-${rowData.status ? 'true' : 'false'}`}>
                            {rowData.status ? 'Đang kinh doanh' : 'Ngừng kinh doanh'}
                        </span>
                    )}
                />
                <Column
                    header="Chức năng"
                    body={(rowData) => (
                        <div>
                            <Button
                                icon="pi pi-pencil"
                                className="p-button-rounded p-button-success p-mr-2"
                                onClick={() => editProduct(rowData)}
                            />
                            <Button
                                icon="pi pi-trash"
                                className="p-button-rounded p-button-danger"
                                onClick={() => deleteProduct(rowData.code)}
                            />
                        </div>
                    )}
                />
            </DataTable>

            <Dialog
                header={isViewMode ? "View Product" : (selectedProduct && selectedProduct.id ? "Edit Product" : "Add Product")}
                visible={visible}
                style={{width: '450px'}}
                onHide={() => setVisible(false)}
                className="custom-dialog"
            >
                <div className="dialog-content">
                    {renderFormField("ID Sản Phẩm", "code", "text", selectedProduct?.code, null, true)}
                    {renderFormField("Tên Sản Phẩm", "name", "text", selectedProduct?.name, (e) => setSelectedProduct({
                        ...selectedProduct,
                        name: e.target.value
                    }))}
                    {renderFormField("Số Lượng", "stock", "number", selectedProduct?.stock, (e) => setSelectedProduct({
                        ...selectedProduct,
                        stock: e.target.value
                    }))}
                    {renderFormField("Đơn Giá", "price", "number", selectedProduct?.price, (e) => setSelectedProduct({
                        ...selectedProduct,
                        price: e.target.value
                    }))}
                    {renderFormField("Đơn Vị", "unit", "text", selectedProduct?.unit, (e) => setSelectedProduct({
                        ...selectedProduct,
                        unit: e.target.value
                    }))}

                    <div className="p-field">
                        <label htmlFor="category">Danh Mục</label>
                        <Dropdown
                            id="category"
                            value={categories.find(cat => cat.id === selectedProduct?.categoryId)}
                            options={categories}
                            onChange={(e) => setSelectedProduct({...selectedProduct, categoryId: e.value.id})}
                            optionLabel="name"
                            placeholder="Select a Category"
                            disabled={isViewMode}
                        />
                    </div>

                    <div className="p-field">
                        <label htmlFor="brand">Nhãn Hàng</label>
                        <Dropdown
                            id="brand"
                            value={brands.find(br => br.id === selectedProduct?.brandId)}
                            options={brands}
                            onChange={(e) => setSelectedProduct({...selectedProduct, brandId: e.value.id})}
                            optionLabel="name"
                            placeholder="Select a Brand"
                            disabled={isViewMode}
                        />
                    </div>

                    <div className="p-field">
                        <label htmlFor="imageName">Hình Ảnh</label>
                        <input
                            id="imageName"
                            type="file"
                            accept="image/*"
                            disabled={isViewMode}
                            onChange={handleImageUpload}
                        />
                    </div>

                    <div className="p-field">
                        <label htmlFor="status">Trạng thái</label>
                        <div className="p-d-flex p-ai-center">
                            <Checkbox
                                id="status"
                                checked={selectedProduct?.status}
                                onChange={(e) => setSelectedProduct({...selectedProduct, status: e.checked})}
                                disabled={isViewMode}
                            />
                            <span className="ml-2">
                                {selectedProduct?.status ? " Đang kinh doanh" : " Ngừng kinh doanh"}
                            </span>
                        </div>
                    </div>

                    <div className="p-grid p-fluid">
                        {/* Warranty */}
                        <div className="p-field p-col-12 p-md-6">
                            <label htmlFor="warranty">Thời hạn bảo hành</label>
                            <Calendar
                                id="warranty"
                                value={selectedProduct?.warranty}
                                onChange={(e) => setSelectedProduct({...selectedProduct, warranty: e.value})}
                                dateFormat="yy-mm-dd"
                                showIcon
                                disabled={isViewMode}
                            />
                        </div>

                        {/* Description */}
                        <div className="p-field p-col-12 p-md-6">
                            <label htmlFor="description">Mô tả sản phẩm</label>
                            <textarea
                                id="description"
                                rows={4}
                                value={selectedProduct?.description}
                                onChange={(e) => setSelectedProduct({...selectedProduct, description: e.target.value})}
                                disabled={isViewMode}
                                required={!isViewMode}
                                className="p-inputtextarea"
                            />
                        </div>

                        {/* Usage */}
                        <div className="p-field p-col-12 p-md-6">
                            <label htmlFor="usage">Cách sử dụng</label>
                            <textarea
                                id="usage"
                                rows={3}
                                value={selectedProduct?.usage}
                                onChange={(e) => setSelectedProduct({...selectedProduct, usage: e.target.value})}
                                disabled={isViewMode}
                                required={!isViewMode}
                                className="p-inputtextarea"
                            />
                        </div>

                        {/* Side Effects */}
                        <div className="p-field p-col-12 p-md-6">
                            <label htmlFor="sideEffects">Tác dụng phụ</label>
                            <textarea
                                id="sideEffects"
                                rows={3}
                                value={selectedProduct?.sideEffects}
                                onChange={(e) => setSelectedProduct({...selectedProduct, sideEffects: e.target.value})}
                                disabled={isViewMode}
                                required={!isViewMode}
                                className="p-inputtextarea"
                            />
                        </div>

                        {/* Storage */}
                        <div className="p-field p-col-12 p-md-6">
                            <label htmlFor="storage">Điều kiện bảo quản</label>
                            <textarea
                                id="storage"
                                rows={3}
                                value={selectedProduct?.storage}
                                onChange={(e) => setSelectedProduct({...selectedProduct, storage: e.target.value})}
                                disabled={isViewMode}
                                required={!isViewMode}
                                className="p-inputtextarea"
                            />
                        </div>

                        {/* Dosage */}
                        <div className="p-field p-col-12 p-md-6">
                            <label htmlFor="dosage">Liều lượng</label>
                            <input
                                id="dosage"
                                type="text"
                                value={selectedProduct?.dosage}
                                onChange={(e) => setSelectedProduct({...selectedProduct, dosage: e.target.value})}
                                disabled={isViewMode}
                                className="p-inputtext"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-d-flex p-jc-between" style={{marginTop: '20px'}}>
                    <Button label="Cancel" icon="pi pi-times" onClick={() => setVisible(false)}
                            className="p-button-text"/>
                    {!isViewMode && <Button label="Save" icon="pi pi-check" onClick={saveProduct}/>}
                </div>
            </Dialog>
        </div>
    );
}

export default AdminProductsModal;