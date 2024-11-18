import axios from "axios";

const createPaymentUrl = (paymentDTO) => {
    return axios.post('/Payments/createPaymentUrl', paymentDTO);

}
const PaymentService = {
    createPaymentUrl
}


export default PaymentService;
