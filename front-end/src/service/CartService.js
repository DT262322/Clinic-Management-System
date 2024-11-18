import axios from "axios";

const createCart = (userId,productId,quantity) =>{
    return axios.post('/Carts', {
        userId: userId,
        productId: productId,
        quantity: quantity
    });
}

const getCartByUserId = (userId, token) =>{
    return axios.get(`/Carts/${userId}`,{
        headers: {
            Authorization: `Bearer ${token}`, // Truyền token vào header
        }
    });
}

const updateQuantityCart = (userId, productId,newQuantity, token) => {
    return axios.put(`/Carts/${userId}/${productId}`, null,{
        params: { quantity: newQuantity }, // Gửi quantity bằng params
        headers: {
            Authorization: `Bearer ${token}`, // Truyền token vào header
        },
    })
}

const deleteCart = (userId, productId, token) =>{
    return axios.delete(`/Carts/${userId}/${productId}`, {
        headers: {
            Authorization: `Bearer ${token}`, // Truyền token vào header
        },
    });
}
const CartService = {
    createCart,
    getCartByUserId,
    updateQuantityCart,
    deleteCart
};

export default CartService;
