using back_end.Data;
using back_end.Models;
using Microsoft.EntityFrameworkCore;

namespace back_end.Services;

public class OrdersService
{
    private readonly DataContext _context;
    private readonly CartsService _cartsService;

    public OrdersService(DataContext context, CartsService cartsService)
    {
        _context = context;
        _cartsService = cartsService;
    }

    // Xem danh sách tất cả các hóa đơn
    public List<Order> GetAllOrderById()
    {
        return _context.Orders.ToList();
    }
    //Xem danh sách hóa đơn theo userId
    public List<Order> GetAllOrdersByUserId(string userId)
    {
        // Validate userId không được null hoặc rỗng
        if (string.IsNullOrEmpty(userId))
        {
            throw new ArgumentException("UserId không được rỗng hoặc null", nameof(userId));
        }

        // Kiểm tra người dùng có tồn tại trong hệ thống không
        var user = _context.Users.FirstOrDefault(u => u.Id == userId);
        if (user == null)
        {
            throw new Exception($"Không tìm thấy người dùng với ID {userId}");
        }

        // Lấy danh sách hóa đơn cho userId
        var orders = _context.Orders
                             .Where(o => o.UserId == userId)
                             .ToList();

        // Trả về danh sách rỗng nếu không có hóa đơn nào cho người dùng
        return orders;
    }
    public void ValidateCart(string userId, List<Cart> cartItems)
    {
        foreach (var cart in cartItems)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == cart.ProductId);
            if (product == null)
            {
                throw new Exception($"Sản phẩm với ID {cart.ProductId} không tồn tại");
            }

            // Kiểm tra sản phẩm có trong giỏ hàng của người dùng không
            var cartItem = _context.Carts.FirstOrDefault(c => c.ProductId == cart.ProductId && c.UserId == userId);
            if (cartItem == null)
            {
                throw new Exception($"Sản phẩm với ID {cart.ProductId} không có trong giỏ hàng của người dùng {userId}");
            }

            // Kiểm tra số lượng sản phẩm hợp lệ không
            if (cart.Quantity <= 0 || cart.Quantity != cartItem.Quantity)
            {
                throw new Exception($"Số lượng sản phẩm không hợp lệ cho sản phẩm với ID {cart.ProductId}");
            }

            // Kiểm tra số lượng sản phẩm có đủ trong kho không
            if (product.Stock < cart.Quantity)
            {
                throw new Exception($"Số lượng sản phẩm không đủ trong kho cho sản phẩm với ID {cart.ProductId}. Số lượng hiện có: {product.Stock}, yêu cầu: {cart.Quantity}");
            }

            // Kiểm tra giá sản phẩm có đúng không
            if (product.Price != cart.UnitPrice)
            {
                cart.UnitPrice = product.Price;
                _cartsService.UpdateUnitPrice(cart.ProductId, cart.UnitPrice);
                throw new Exception($"Giá sản phẩm với ID {cart.ProductId} đã được thay đổi thành {cart.UnitPrice}");
            }
        }
    }


    public Order CreateOrder(List<int> cartItemIds, string userId)
    {
        if (cartItemIds == null || cartItemIds.Count == 0)
        {
            throw new Exception("Giỏ hàng trống");
        }

        var listCart = _context.Carts
       .Where(c => cartItemIds.Contains(c.Id) && c.UserId == userId)
       .ToList();
        if (listCart.Count == 0)
        {
            throw new Exception("Không tìm thấy sản phẩm trong giỏ hàng");
        }

        ValidateCart(userId, listCart);

        var totalAmount = listCart.Sum(c => c.Quantity * c.UnitPrice);

        var newOrder = new Order()
        {
            Total = totalAmount,
            DeliveryDate = DateTime.Now.AddDays(3),
            Status = false,
            UserId = userId
        };

        // Thêm dữ liệu vào DB
        _context.Orders.Add(newOrder);
        _context.SaveChanges();

        // Tạo chi tiết đơn hàng
        foreach (var cart in listCart)
        {
            var orderDetail = new OrderDetail()
            {
                ProductId = cart.ProductId,
                Quantity = cart.Quantity,
                UnitPrice = cart.UnitPrice,
                OrderId = newOrder.Id
            };

            _context.OrderDetails.Add(orderDetail);
        }
        _context.SaveChanges();

        return newOrder;
    }
    //Cập nhật trạng thái staus khi thanh toán thành công
    public void UpdateStatus(int id)
    {   
        var orderItem = _context.Orders.Find(id);
        if (orderItem == null)
        {
            Console.WriteLine("Hóa đơn không tồn tại");
            throw new Exception("Hóa đơn không tồn tại");
        }

        orderItem.Status = true;
        _context.Orders.Update(orderItem);

        // Xóa danh sách sản phẩm đã thanh toán ra khỏi giỏ hàng
        var productIds = _context.OrderDetails
                                  .Where(o => o.OrderId == id)
                                  .Select(o => o.ProductId)
                                  .ToList();

        var cartItems = _context.Carts
                                 .Where(c => productIds.Contains(c.ProductId) && c.UserId == orderItem.UserId)
                                 .ToList();

        if (cartItems.Any())
        {
            _context.Carts.RemoveRange(cartItems);
        }

        _context.SaveChanges();
    }


}