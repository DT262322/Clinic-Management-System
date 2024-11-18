using back_end.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using back_end.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailsController : ControllerBase
    {
        private readonly OrderDetailsService _orderDetailsService;

        public OrderDetailsController(OrderDetailsService orderDetailsService)
        {
            _orderDetailsService = orderDetailsService;
        }

        // Lấy tất cả chi tiết đơn hàng
        [HttpGet]
        public async Task<ActionResult<List<OrderDetail>>> GetAllOrderDetails()
        {
            var orderDetails = await _orderDetailsService.GetAllOrderDetails();
            return Ok(orderDetails);
        }

        // Lấy chi tiết đơn hàng theo orderId
        [HttpGet("/api/OrderDetail/{orderId}")]
        public async Task<ActionResult<List<OrderDetail>>> GetOrderDetailsByOrderId(int orderId)
        {
            var orderDetails = await _orderDetailsService.GetOrderDetailsByOrderId(orderId);

            // Kiểm tra nếu đơn hàng không tồn tại hoặc không có chi tiết
            if (orderDetails == null || !orderDetails.Any())
            {
                return NotFound("Không tìm thấy đơn đặt hàng nào.");
            }

            return Ok(orderDetails); // Trả về chi tiết đơn hàng
        }
    }
}
