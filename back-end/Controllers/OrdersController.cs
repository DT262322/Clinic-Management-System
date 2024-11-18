using back_end.Models;
using back_end.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly OrdersService _ordersService;

        public OrdersController(OrdersService ordersService)
        {
            _ordersService = ordersService;
        }

        [HttpGet("/api/admin/Orders")]
        public ActionResult<IEnumerable<Product>> GetOrderForAdmin()
        {
            try
            {
                var ordersAdmin = _ordersService.GetAllOrderById();
                if (ordersAdmin == null || ordersAdmin.Count == 0)
                {
                    return NotFound("Không có orders.");
                }
                return Ok(ordersAdmin); // Đảm bảo trả về Ok khi thành công
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving orders: {ex.Message}");
            }
        }

        //Tạo 1 Order mới
        [HttpPost("/api/admin/Order/add")]
        public IActionResult CreateOrder([FromBody]List<int> cartIds, string userId)
        {
            try
            {
                var order = _ordersService.CreateOrder(cartIds, userId);
                return Ok(new {id = order.Id, total = order.Total});
            }
            catch (Exception ex)
            {
                // Xử lý ngoại lệ và trả về mã trạng thái 500 cùng thông báo lỗi
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }
        //Sửa trạng thái status khi thanh toán thành công
        [HttpPut("/api/admin/Order/update-status/{id}")]
        public IActionResult UpdateStatus(int id)
        {
            try
            {
                _ordersService.UpdateStatus(id);

                return Ok(new { Message = "Đã xóa sản phẩm ra khỏi giỏ hàng" });
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Error updating status: {ex.Message}");
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }

        // Lấy đơn hàng theo ID
        [HttpGet("{id}")]
        public ActionResult<Order> GetOrderById(int id)
        {
            try
            {
                var order = _ordersService.GetAllOrderById().FirstOrDefault(o => o.Id == id);
                if (order == null)
                {
                    return NotFound();
                }
                return order;
            }
            catch (Exception ex)
            {
                // Xử lý ngoại lệ và trả về mã trạng thái 500 cùng thông báo lỗi
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }

        //Lấy hóa đơn theo userID
        [HttpGet("/api/Orders/user/{userId}")]
        public ActionResult GetOrdersByUserId(string userId)
        {
            try
            {
                var orders = _ordersService.GetAllOrdersByUserId(userId);
                if (orders == null || !orders.Any())
                {
                    return NotFound(new { message = $"Không có hóa đơn nào cho người dùng với ID {userId}" });
                }
                return Ok(orders);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Ghi log lỗi ở đây nếu cần
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi xử lý yêu cầu", details = ex.Message });
            }
        }

    }
}