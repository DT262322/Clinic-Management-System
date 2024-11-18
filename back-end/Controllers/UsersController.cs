using back_end.DTOs.Request;
using back_end.Models;
using back_end.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly RegisterService _registerService;

        public UsersController(RegisterService registerService)
        {
            _registerService = registerService;
        }


        [HttpPost("register")]
        public async Task<ActionResult> Register(UserRequestsDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid data.");
            }

            try
            {
                var result = await _registerService.RegisterAsync(request);

                if (result.StartsWith("Error"))
                {
                    return BadRequest(result);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequestDTO request)
        {
            var token = await _registerService.LoginAsycn(request);
            if (token == "Người dùng chưa được đăng ký" || token == "Mật khẩu không chính xác")
            {
                return Unauthorized(token); // Trả về Unauthorized nếu thông tin không đúng
            }

            // Trả về token nếu đăng nhập thành công
            return Ok(new
            {
                token = token,

            });
        }
    }
}
