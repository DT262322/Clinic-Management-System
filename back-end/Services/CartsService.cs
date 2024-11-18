using back_end.Data;
using back_end.DTOs.Request;
using back_end.Models;
using Microsoft.EntityFrameworkCore;

namespace back_end.Services;

public class CartsService
{
    private readonly DataContext _context;

    public CartsService(DataContext context)
    {
        _context = context;
    }

    //Lấy ra danh sách sản phẩm vào giỏ hàng theo user
    public List<Cart> GetCartByUserId(string userId)
    {
        return _context.Carts.Include(c => c.Product)
                           .Where(c => c.UserId == userId)
                           .ToList();
    }

    //Thêm sản phẩm vào giỏ hàng
    public Cart AddToCart(CartCreateRequestDTO request)
    {
        // Kiểm tra input
        if (request.quantity <= 0)
        {
            throw new ArgumentException("Số lượng phải lớn hơn 0.");
        }

        if (string.IsNullOrEmpty(request.UserId))
        {
            throw new ArgumentException("UserId không hợp lệ.");
        }
        var product = _context.Products.Find(request.productId);
        if (product == null)
        {
            throw new Exception("Sản phẩm không tồn tại");
        }
        var cartItem = _context.Carts.FirstOrDefault(c => c.UserId == request.UserId && c.ProductId == request.productId);
        if (cartItem! != null)
        //Kiểm tra nếu sản phẩm đã có thì cộng thêm vào quanity và cập nhật lại total
        {
            cartItem.Quantity += request.quantity;
            cartItem.Total = cartItem.Quantity + cartItem.UnitPrice;
        }
        else
        {
            //Sản phẩm chưa có thì thêm sp vào giỏ hàng và cập nhật lại total
            cartItem = new Cart
            {
                UserId = request.UserId,
                ProductId = request.productId,
                Quantity = request.quantity,
                UnitPrice = product.Price,
                Total = request.quantity * product.Price

            };
            _context.Carts.Add(cartItem);
        }
        _context.SaveChanges();
        return cartItem;
    }
    //Cập nhật số lượng trong giỏ hàng
    public Cart UpdateCartItem(string userId, int productId, int newQuantity)
    {
        var cartItem = _context.Carts.FirstOrDefault(c => c.UserId == userId && c.ProductId == productId);
        if (cartItem == null)
        {
            throw new Exception("Không tìm thấy sản phẩm");
        }

        if (newQuantity == 0)
        {
            // Xóa sản phẩm khỏi giỏ hàng nếu sửa số lượng là 0
            _context.Carts.Remove(cartItem);
        }
        else
        {
            //Sửa lại số lượng mới
            cartItem.Quantity = newQuantity;
            cartItem.Total = newQuantity * cartItem.UnitPrice;
        }

        _context.SaveChanges();
        return cartItem;
    }
    // Xóa sản phẩm ra khỏi giỏ hàng
    public void DeleteProductFromCart(string userId, int productId)
    {
        var cartItem = _context.Carts.FirstOrDefault(c => c.UserId == userId && c.ProductId == productId);
        if (cartItem != null)
        {
            _context.Carts.Remove(cartItem);
            _context.SaveChanges();
        }
    }

    //Cập nhât lại giá sản phẩm trong giỏ hàng
    public void UpdateUnitPrice(int productId, long unitPrice)
    {
        var cartItem = _context.Carts.FirstOrDefault(c => c.ProductId == productId);
        if(cartItem == null)
        {
            throw new Exception("Sản phẩm không tồn tại");
        }
        cartItem.UnitPrice = unitPrice;
        cartItem.Total = cartItem.UnitPrice * cartItem.Quantity;

        //cập nhật lại giá
        _context.Carts.Update(cartItem);
        _context.SaveChanges();

    }
}