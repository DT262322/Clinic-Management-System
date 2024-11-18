using back_end.DTOs.Request;
using back_end.Migrations;
using back_end.Services;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
namespace back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;
        private readonly OrdersService _ordersService;

        public PaymentsController(IVnPayService vnPayService, OrdersService ordersService)
        {
            _vnPayService = vnPayService;
            _ordersService = ordersService;
        }

        /// <summary>
        /// Tiếp nhận thông tin đơn hàng, xử lý thông tin,
        /// tạo Url để gửi yêu cầu xử lý thanh toán tới VnPay.
        /// </summary>
        /// <param name="requestDto"></param>
        /// <returns></returns>
        [HttpPost("createPaymentUrl")]
        public IActionResult CreatePaymentUrl(PaymentInformationRequestDto requestDto)
        {
            var url = _vnPayService.CreatePaymentUrl(requestDto, HttpContext);
            return Ok(url);
        }

        /// <summary>
        /// Tiếp nhận và xử lý phản hồi của VnPay sau khi thanh toán.
        /// </summary>
        /// <returns></returns>
        [HttpGet("paymentCallback")]
        public IActionResult PaymentCallback()
        {
            var response = _vnPayService.PaymentExecute(Request.Query);
            string orderDescription = Request.Query["vnp_OrderInfo"];
            int orderId = int.Parse(Regex.Match(orderDescription, @"^\d+").Value);

            if (response.Success && response.VnPayResponseCode == "00")
            {
                _ordersService.UpdateStatus(orderId);
                return Redirect("http://localhost:3000/order-confirm?message=success");
            }
            else if(response.VnPayResponseCode == "24")
            {
                return Redirect("http://localhost:3000/order-confirm?message=cancel");
            }
            else
            {
                return Redirect("http://localhost:3000/order-confirm?message=error");
            }
            
            // Check kết quả từ response trả về. Success == True, VnPayResponseCode == "00",
            // Thay đổi trạng thái đơn hàng (nêu nghiệp vụ có).
            // Tạo invoice (nêu nghiệp vụ có).
            // Xử lý các trường hợp không thành công khác tương ứng với VnPayResponseCode.
            
        }
    }
}
