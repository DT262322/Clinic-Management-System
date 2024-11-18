using back_end.Data;
using back_end.Models;
using Microsoft.EntityFrameworkCore;

namespace back_end.Services
{
    public class ProductsService
    {
        private readonly DataContext _context;
        private static readonly Random Random = new Random(); // Khởi tạo Random một lần
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly S3Service _s3Service;
        public ProductsService(DataContext context, IWebHostEnvironment webHostEnvironment, S3Service s3Service)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
            _s3Service = s3Service;
        }

        // CRUD của Product

        // Lấy sản phẩm theo Id
        public Product GetProductById(int id, bool checkStatus = true)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == id);
            if (product == null)
            {
                throw new KeyNotFoundException("Sản phẩm không tồn tại.");
            }

            if (checkStatus && !product.Status)
            {
                throw new InvalidOperationException("Sản phẩm không khả dụng.");
            }

            return product;
        }
        // Lấy danh sách các sản phẩm trang admin
        public List<Product> GetAllProductForAdmin()
        {
            return _context.Products.ToList();
        }

        // GetAll (lấy tất cả sản phẩm với status == true) trang user
        public List<Product> GetAllProductForUser()
        {
            return _context.Products
                            .Where(p => p.Status == true)
                            .ToList();
        }

        // GetbyCodeForAdmin
        public Product GetProductByCodeForAdmin(string code)
        {
            return _context.Products.FirstOrDefault(p => p.Code == code);
        }
        // GetbyCodeForUser
        public Product GetProductByCodeForUser(string code)
        {
            return _context.Products
                .FirstOrDefault(p => p.Code == code && p.Status == true);
        }
        //GetbyIdForAdmin
        public Product GetProductByIdForAdmin(int id)
        {
            return _context.Products.Find(id);
        }//GetbyIdForUser
        public Product GetProductByIdForUser(int id)
        {
            return _context.Products.FirstOrDefault(p => p.Id == id && p.Status == true);

        }

        // Add
        public void AddProduct(Product product)
        {
            product.Code = GenerateCodeProduct();

            _context.Products.Add(product);
            _context.SaveChanges();
        }

        public void UpdateProduct(Product product)
        {
            var existingProduct = _context.Products.FirstOrDefault(p => p.Code == product.Code);

            if (existingProduct == null)
            {
                throw new KeyNotFoundException("Sản phẩm không tồn tại.");
            }

            // Cập nhật các thuộc tính của sản phẩm hiện có với giá trị từ updatedProduct
            existingProduct.Name = product.Name;
            existingProduct.Stock = product.Stock;
            existingProduct.Price = product.Price;
            existingProduct.Unit = product.Unit;
            existingProduct.ImageName = product.ImageName;
            existingProduct.Warranty = product.Warranty;
            existingProduct.Description = product.Description;
            existingProduct.Usage = product.Usage;
            existingProduct.SideEffects = product.SideEffects;
            existingProduct.Storage = product.Storage;
            existingProduct.Dosage = product.Dosage;
            existingProduct.Status = product.Status;
            existingProduct.BrandId = product.BrandId;
            existingProduct.CategoryId = product.CategoryId;

            // Lưu các thay đổi
            _context.SaveChanges();
        }


        // Delete (thay đổi trạng thái status == false)
        public void DeleteProduct(string code)
        {
            var product = _context.Products.FirstOrDefault(p => p.Code == code);
            if (product == null)
            {
                throw new KeyNotFoundException("Sản phẩm không tồn tại.");
            }

            product.Status = false;
            _context.Products.Update(product);
            _context.SaveChanges();
        }

        // Kiểm tra product có tồn tại không
        public bool ProductExists(string code)
        {
            return _context.Products.Any(p => p.Code == code);
        }

        // Hàm sinh mã sản phẩm tự động và duy nhất
        private string GenerateCodeProduct()
        {
            string code;
            do
            {
                code = GenerateRandomCode();
            }
            while (_context.Products.Any(p => p.Code == code));
            return code;
        }

        private string GenerateRandomCode()
        {
            const int codeLength = 20;
            const string characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var code = new char[codeLength];

            for (int i = 0; i < codeLength; i++)
            {
                code[i] = characters[Random.Next(characters.Length)];
            }
            return new string(code);
        }

        //Upload hình ảnh
        public Product UploadProductImage(int productId, IFormFile imageFile)
        {
            var product = _context.Products.Find(productId);
            if (product == null)
            {
                throw new Exception("Sản phẩm không tồn tại.");
            }

            if (imageFile == null || imageFile.Length == 0)
            {
                throw new Exception("File ảnh không hợp lệ.");
            }

            // Tạo tên file duy nhất
            var fileName = Path.GetFileNameWithoutExtension(imageFile.FileName);
            var extension = Path.GetExtension(imageFile.FileName);
            var newFileName = $"{fileName}_{DateTime.Now:yyyyMMddHHmmss}{extension}";
            var uploadPath = Path.Combine(_webHostEnvironment.WebRootPath, "uploads", newFileName);

            // Lưu file ảnh vào thư mục trên server
            using (var stream = new FileStream(uploadPath, FileMode.Create))
            {
                imageFile.CopyTo(stream);
            }

            // Cập nhật thuộc tính ImageName trong Product
            product.ImageName = newFileName;

            _context.Products.Update(product);
            _context.SaveChanges();

            return product;
        }

        public async Task<Product> UploadProductImageByCodeAsync(string productCode, IFormFile imageFile)
        {
            if (imageFile == null || imageFile.Length == 0)
            {
                throw new ArgumentException("File ảnh không hợp lệ.");
            }

            // Tìm sản phẩm theo mã code
            var product = await _context.Products.FirstOrDefaultAsync(p => p.Code == productCode);
            if (product == null)
            {
                throw new Exception("Sản phẩm không tồn tại.");
            }

            // Tạo tên file duy nhất
            var fileName = Path.GetFileNameWithoutExtension(imageFile.FileName);
            var extension = Path.GetExtension(imageFile.FileName);
            var newFileName = $"{fileName}_{DateTime.Now:yyyyMMddHHmmss}{extension}";

            // Tải lên file vào S3
            using (var stream = imageFile.OpenReadStream())
            {
                using (var memoryStream = new MemoryStream())
                {
                    await stream.CopyToAsync(memoryStream); // Sử dụng phương thức async
                    memoryStream.Position = 0; // Đặt lại vị trí stream về đầu trước khi upload
                    await _s3Service.UploadFileAsync(newFileName, memoryStream); // Gọi phương thức upload async
                }
            }

            // Cập nhật thuộc tính ImageName trong Product
            product.ImageName = newFileName;
            _context.Products.Update(product);
            await _context.SaveChangesAsync(); // Lưu thay đổi một cách async

            return product;
        }
        public List<Product> GetProductsForCategory13()
        {
            int categoryId = 13; // CategoryID cố định là 13
            return _context.Products
                           .Where(p => p.CategoryId == categoryId && p.Status == true)
                           .ToList();
        }
        public List<Product> GetProductsByBrand()
        {
            int brandId = 32;
            return _context.Products
                           .Where(p => p.BrandId == brandId && p.Status == true)
                           .ToList();
        }
        public List<Product> GetCheapProducts(decimal maxPrice = 100000)
        {
            return _context.Products
                           .Where(p => p.Price <= maxPrice && p.Status == true)
                           .ToList();
        }





    }
}
