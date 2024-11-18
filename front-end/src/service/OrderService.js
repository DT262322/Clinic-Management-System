import axios from "axios";
//Admin
const createOrder = (carts, userId) => {

    return axios.post(`/admin/Order/add?userId=${userId}`, carts);
}

//User

const OrderService = {
    createOrder
}
export default OrderService;
