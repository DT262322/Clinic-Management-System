using back_end.Data;
using back_end.DTOs.Request;
using back_end.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace back_end.Services
{
    public class OrderDetailsService
    {
        private readonly DataContext _context;

        public OrderDetailsService(DataContext context)
        {
            _context = context;
        }

        // Lấy tất cả các chi tiết đơn hàng
        public async Task<List<OrderDetail>> GetAllOrderDetails()
        {
            return await _context.OrderDetails
                .Include(od => od.Product) // Bao gồm thông tin sản phẩm
                .ToListAsync();
        }

        // Lấy chi tiết đơn hàng theo orderId
        public async Task<List<OrderDetailDto>> GetOrderDetailsByOrderId(int orderId)
        {
            var orderDetails = await _context.OrderDetails
                .Where(od => od.OrderId == orderId)
                .Include(od => od.Product)  
                .Select(od => new OrderDetailDto
                {
                    ProductName = od.Product.Name, 
                    Quantity = od.Quantity,
                    UnitPrice = od.UnitPrice,
                    OrderId = od.OrderId
                })
                .ToListAsync();

            return orderDetails;
        }

    }
}
