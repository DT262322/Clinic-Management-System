//using back_end.Data;
//using back_end.Models;

//namespace back_end.Services;

//public class ImagesService
//{
//    private readonly DataContext _context;
//    private readonly IWebHostEnvironment _webHostEnvironment;

//    public ImagesService(DataContext context, IWebHostEnvironment webHostEnvironment)
//    {
//        _context = context;
//        _webHostEnvironment = webHostEnvironment;
//    }
//    public Product UploadProductImage(int productId, IFormFile imageFile)
//    {
//        var product = _context.Products.Find(productId);
//        if (product == null)
//        {
//            throw new Exception("Không tìm thấy sản phẩm ");
//        }
//        if(imageFile == null || imageFile.Length == 0)
//        {
//            throw new Exception("File ảnh không hợp lệ");
//        }
//        // Tạo tên file duy nhất
//        var fileName = Path.GetFileNameWithoutExtension(imageFile.FileName);
//        var extension = Path.GetExtension(imageFile.FileName);
//        var newFileName = $"{fileName}_{DateTime.Now:yyyyMMddHHmmss}{extension}";
//        var uploadPath = Path.Combine(_webHostEnvironment.WebRootPath, "upload", newFileName);

//        // Lưu file ảnh vào thư mục trên server
//        using (var stream = new FileStream(uploadPath, FileMode.Create))
//        {
//            imageFile.CopyTo(stream);
//        }

//        //Cập nhật lại tên hình ảnh
//        product.ImageName = newFileName; 
//        _context.Products.Update(product);
//        _context.SaveChanges(); 
//        return product;

//    }
//}
using System;
using System.IO;
using System.Threading.Tasks;
using back_end.Data;
using back_end.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;

namespace back_end.Services
{
    public class ImagesService
    {
        private readonly DataContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ILogger<ImagesService> _logger;

        public ImagesService(DataContext context, IWebHostEnvironment webHostEnvironment, ILogger<ImagesService> logger)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
            _logger = logger;
        }

        public Product UploadProductImage(int productId, IFormFile imageFile)
        {
            var product = _context.Products.Find(productId);
            if (product == null)
            {
                throw new Exception("Không tìm thấy sản phẩm.");
            }

            if (imageFile == null || imageFile.Length == 0)
            {
                throw new Exception("File ảnh không hợp lệ.");
            }

            // Tạo tên file duy nhất
            var fileName = Path.GetFileNameWithoutExtension(imageFile.FileName);
            var extension = Path.GetExtension(imageFile.FileName);
            var newFileName = $"{fileName}_{DateTime.Now:yyyyMMddHHmmss}{extension}";
            var uploadPath = Path.Combine(_webHostEnvironment.WebRootPath, "upload", newFileName);

            try
            {
                // Đảm bảo thư mục tồn tại
                var directory = Path.GetDirectoryName(uploadPath);
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                // Lưu file ảnh vào thư mục trên server
                using (var stream = new FileStream(uploadPath, FileMode.Create))
                {
                    imageFile.CopyTo(stream);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving the image file.");
                throw new Exception("Đã xảy ra lỗi khi lưu file ảnh.");
            }

            // Cập nhật lại tên hình ảnh
            product.ImageName = newFileName;
            _context.Products.Update(product);
            _context.SaveChanges();

            return product;
        }
    }
}
