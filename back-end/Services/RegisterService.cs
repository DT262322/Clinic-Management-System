using back_end.Data;
using back_end.DTOs.Request;
using back_end.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace back_end.Services
{
    public class RegisterService
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
        public RegisterService(UserManager<User> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }


        public async Task<string> RegisterAsync(UserRequestsDTO request)
        {
            var user = new User
            {
                UserName = request.Username,
                Email = request.Email

            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (result.Succeeded)
            {
                return "User registered successfully.";
            }

            string errors = string.Join(", ", result.Errors.Select(e => e.Description));
            return $"Error registering user: {errors}";
        }


        public async Task<string> LoginAsycn(LoginRequestDTO request)
        {
            try
            {
                // Tìm kiếm người dùng theo Username
                var user = await _userManager.FindByNameAsync(request.Username);
                if (user == null)
                {
                    return "Người dùng chưa được đăng ký";
                }

                // Kiểm tra mật khẩu
                var isPasswordValid = await _userManager.CheckPasswordAsync(user, request.Password);
                if (!isPasswordValid)
                {
                    return "Mật khẩu không chính xác";
                }

                // Nếu xác thực thành công, tạo token JWT
                var authClaims = new List<Claim>
                {
                   new Claim("UserName", user.UserName),
                   new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                   new Claim("UserId", user.Id),
                   new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                };

                var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

                var token = new JwtSecurityToken(
                    issuer: _configuration["JWT:ValidIssuer"],
                    audience: _configuration["JWT:ValidAudience"],
                    expires: DateTime.Now.AddHours(5),
                    claims: authClaims,
                    signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            catch (Exception ex)
            {
                // Bắt lỗi tổng quát và trả về thông báo lỗi
                return $"Đã xảy ra lỗi trong quá trình đăng nhập: {ex.Message}";
            }
        }
    }
}
