using back_end.DTOs.Request;
using back_end.Models;
using back_end.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
   
    public class CartsController : ControllerBase
    {
        private readonly CartsService _cartsService;

        public CartsController(CartsService cartsService)
        {
            _cartsService = cartsService;
        }
        //Lấy ra tất cả sản phẩm từ userId
        [HttpGet("{userId}")]
        public ActionResult<IEnumerable<Cart>> GetAllProductFromCart(string userId)
        {
            try
            {
                var carts = _cartsService.GetCartByUserId(userId);
              
                if (carts == null || !carts.Any())
                {

                    return new List<Cart>();

                }
                return carts;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }
        [HttpPost]
        public ActionResult<Cart> AddToCart(CartCreateRequestDTO request)
        {

            try
            {
                var cart = _cartsService.AddToCart(request);
                return cart;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }
        [HttpPut("{userId}/{productId}")]
        public ActionResult<Cart> UpdateCartItem(string userId, int productId, int quantity)
        {
            try
            {
                var cart = _cartsService.UpdateCartItem(userId, productId, quantity);
                return Ok(cart);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }

        // Xóa sản phẩm khỏi giỏ hàng
        [HttpDelete("{userId}/{productId}")]
        public IActionResult RemoveFromCart(string userId, int productId)
        {
            try
            {
                _cartsService.DeleteProductFromCart(userId, productId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }

        

    }
}