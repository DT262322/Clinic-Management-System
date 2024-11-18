using back_end.Data;
using back_end.Models;
using back_end.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static back_end.Services.ProductsService;

namespace back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ProductsService _productsService;
        private readonly DataContext _context;
        private readonly S3Service _s3Service;

        public ProductsController(ProductsService productsService, DataContext context, S3Service s3Service)
        {
            _productsService = productsService;
            _s3Service = s3Service;
            _context = context;
        }
        // ---------------------- API cho Admin ----------------------

     

        // GET: api/Products/admin
        [HttpGet("/api/admin/Products")]
        public ActionResult<IEnumerable<Product>> GetProductsForAdmin()
        {
            try
            {
                var productsAdmin = _productsService.GetAllProductForAdmin();
                if (productsAdmin == null || productsAdmin.Count == 0)
                {
                    return NotFound("Không có sản phẩm.");
                }
                return Ok(productsAdmin); // Đảm bảo trả về Ok khi thành công
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving products: {ex.Message}");
            }
        }


        // GET: api/admin/Products/{id} - Chỉ dành cho Admin
        [HttpGet("/api/admin/Products/{id}")]
        public ActionResult<Product> GetProductByIdForAdmin(int id)
        {
            try
            {
                var product = _productsService.GetProductById(id);
                if (product == null)
                {
                    return NotFound("Không tìm thấy sản phẩm.");
                }

                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving product: {ex.Message}");
            }
        }

        // GET: api/Products/admin/{code} - Chỉ dành cho Admin
        [HttpGet("/api/admin/Products/detail/{code}")]
        public ActionResult<Product> GetProductByCodeForAdmin(string code)
        {
            try
            {
                // Admin có quyền xem tất cả sản phẩm bất kể status
                var product = _productsService.GetProductByCodeForAdmin(code);
                if (product == null)
                {
                    return NotFound("Không tìm thấy sản phẩm.");
                }

                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving product: {ex.Message}");
            }
        }

        // GET: api/Products/admin/detail/{id}
        [HttpGet("admin/detail/{id}")]
        public ActionResult<Product> GetDetailByIdForAdmin(int id)
        {
            try
            {
                var product = _productsService.GetProductById(id);

                if (product == null)
                {
                    return NotFound("Sản phẩm không tồn tại.");
                }

                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Lỗi khi lấy thông tin sản phẩm: {ex.Message}");
            }
        }



       
        

        // POST: api/Products
        [HttpPost("/api/admin/Products/add")]
        public ActionResult<Product> AddProduct(Product product)
        {
            try
            {
                _productsService.AddProduct(product);
                return CreatedAtAction(nameof(GetProductByCodeForAdmin), new { code = product.Code }, product);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error adding product: {ex.Message}");
            }
        }
        // POST: api/admin/Products/add
        [HttpPost("addwithimage")]
        public ActionResult<Product> AddProduct( Product product,  IFormFile imageFile)
        {
            try
            {
                // Thêm sản phẩm vào cơ sở dữ liệu
                _productsService.AddProduct(product);

                // Xử lý upload ảnh nếu có
                if (imageFile != null && imageFile.Length > 0)
                {
                    // Upload ảnh và cập nhật tên ảnh cho sản phẩm
                    var updatedProduct = _productsService.UploadProductImage(product.Id, imageFile);
                    return CreatedAtAction(nameof(GetProductByCodeForAdmin), new { code = updatedProduct.Code }, updatedProduct);
                }
                else
                {
                    // Nếu không có ảnh, trả về sản phẩm đã thêm
                    return CreatedAtAction(nameof(GetProductByCodeForAdmin), new { code = product.Code }, product);
                }
            }
            catch (Exception ex)
            {
                // Trả về lỗi server nếu có lỗi xảy ra
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error adding product: {ex.Message}");
            }
        }

        // PUT: api/Products/{code}
        [HttpPut("/api/admin/Products/edit/{code}")]
        public IActionResult UpdateProduct(string code, Product product)
        {
            if (string.IsNullOrEmpty(product.Code) || code != product.Code)
            {
                return BadRequest("Mã sản phẩm không khớp hoặc mã sản phẩm trống.");
            }

            if (!_productsService.ProductExists(code))
            {
                return NotFound("Sản phẩm không tồn tại.");
            }

            try
            {
                _productsService.UpdateProduct(product);
                return NoContent();
            }
            catch (Exception ex)
            {
                // Log lỗi tại đây nếu cần thiết
                return StatusCode(StatusCodes.Status500InternalServerError, "Có lỗi xảy ra khi cập nhật sản phẩm.");
            }
        }

        // DELETE: api/Products/{code}
        [HttpDelete("/api/admin/Products/delete/{code}")]
        public IActionResult DeleteProduct(string code)
        {
            try
            {
                if (!_productsService.ProductExists(code))
                {
                    return NotFound("Sản phẩm không tồn tại.");
                }

                _productsService.DeleteProduct(code);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error deleting product: {ex.Message}");
            }
        }
        // ---------------------- API cho User ----------------------


        // GET: api/Products
        [HttpGet]
        public ActionResult<IEnumerable<Product>> GetProductsForUser()
        {
            try
            {
                var productsUser = _productsService.GetAllProductForUser();
                if (productsUser == null || productsUser.Count == 0)
                {
                    return NotFound("Không có sản phẩm.");
                }
                return Ok(productsUser);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving products: {ex.Message}");
            }
        }





        // GET: api/Products/{id} - Chỉ dành cho User, kiểm tra status == true
        [HttpGet("/api/Products/detail/{id}")]
        public ActionResult<Product> GetProductByIdForUser(int id)
        {
            try
            {
                var product = _productsService.GetProductById(id);
                if (product == null || product.Status != true)
                {
                    return NotFound("Không tìm thấy sản phẩm hoặc sản phẩm không khả dụng.");
                }

                return Ok(product);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving product: {ex.Message}");
            }
        }


        /// <summary>
        /// Action tham khảo test chức năng upload image to AWS S3
        /// </summary>
        /// <param name="file"></param>
        /// <returns></returns>
        [HttpPost("upload-image/{productCode}")]
        public async Task<ActionResult<Product>> UploadProductImage(string productCode, IFormFile imageFile)
        {
            try
            {
                // Gọi phương thức UploadProductImageByCodeAsync để xử lý việc upload ảnh
                var updatedProduct = await _productsService.UploadProductImageByCodeAsync(productCode, imageFile);

                // Trả về sản phẩm đã cập nhật sau khi upload hình ảnh
                return Ok(updatedProduct);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        /// <summary>
        /// Action tham khảo test chức năng delete image to AWS S3
        /// </summary>
        /// <param name="fileKey"></param>
        /// <returns></returns>
        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteImageFromAws(string fileKey)
        {
            await _s3Service.DeleteFileAsync(fileKey);
            return Ok("Deleted file successfully");
        }

        [HttpGet("/api/Products/category/13")]
        public ActionResult<IEnumerable<Product>> GetProductsForCategory13()
        {
            try
            {
                var products = _productsService.GetProductsForCategory13();
                if (products == null || products.Count == 0)
                {
                    return NotFound("Không có sản phẩm.");
                }
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving products: {ex.Message}");
            }
        }

        [HttpGet("/api/Products/cheap")]
        public ActionResult<IEnumerable<Product>> GetCheapProducts()
        {
            try
            {
                var products = _productsService.GetCheapProducts();
                if (products == null || products.Count == 0)
                {
                    return NotFound("Không có sản phẩm.");
                }
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving products: {ex.Message}");
            }
        }

        [HttpGet("/api/Products/brand/32")]
        public ActionResult<IEnumerable<Product>> GetProductsByBrand()
        {
            try
            {
                var products = _productsService.GetProductsByBrand();
                if (products == null || products.Count == 0)
                {
                    return NotFound("Không có sản phẩm.");
                }
                return Ok(products);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error retrieving products: {ex.Message}");
            }
        }



    }
}