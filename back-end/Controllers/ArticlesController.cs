using back_end.Data;
using back_end.Models;
using back_end.Services;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticlesController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly ArticlesService _articlesService;

        public ArticlesController(DataContext context, ArticlesService articlesService)
        {
            _context = context;
            _articlesService = articlesService;
        }
        // ---------------------- API cho Admin ----------------------


        //API lấy bài viết theo status
        [HttpGet("/api/admin/Articles")]
        public ActionResult<IEnumerable<Article>> GetArticlesForAdmin()
        {
            var articleAdmin = _articlesService.GetAllArticleForAdmin();
            return articleAdmin;
        }
        //Xem chi tiết
        [HttpGet("/api/admin/Articles/detail/{id}")]
        public ActionResult<Article> GetArticleByIdForAdmin(int id)
        {
            var article = _articlesService.GetArticleByIdForAdmin(id);
            if (article == null)
            {
                return NotFound(new { message = "Bài viết không tồn tại." });
            }
            return article;
        }
        //Thêm bài viết
        [HttpPost("/api/admin/Articles/add")]
        public ActionResult<Article> Add(Article article)
        {
            var addedArticle = _articlesService.AddArticle(article);
            if (addedArticle == null)
            {
                return BadRequest(new { message = "Không thể thêm bài viết." });
            }
            // Trả về URL cho phương thức GetArticleByIdForAdmin
            return CreatedAtAction(nameof(GetArticleByIdForAdmin), new { id = addedArticle.Id }, addedArticle);
        }
        //Thay đổi trạng thái bài viết từ true sang false
        [HttpDelete("/api/admin/Articles/delete/{id}")]
        public ActionResult<Article> DeleteArticle(int id)
        {
            try
            {
                _articlesService.DeleteArticle(id);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
            return NoContent();
        }
        //Sủa bài viết
        [HttpPut("/api/admin/Articles/edit/{id}")]
        public ActionResult<Article> EditArticle(int id, Article article)
        {
            if (article.Id != id)
            {
                return BadRequest(new { message = "ID bài viết không khớp." });
            }
            try
            {
                _articlesService.UpdateArticle(article);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
            return NoContent();
        }

        // ---------------------- API cho User ----------------------
        [HttpGet]
        public ActionResult<IEnumerable<Article>> GetArticlesForUser()
        {
            var articleUser = _articlesService.GetAllArticleForUser();
            return articleUser;
        }
        [HttpGet("detail/{id}")]
        public ActionResult<Article> GetArticleByIdForUser(int id)
        {
            var article = _articlesService.GetArticleByIdForUser(id);
            if (article == null)
            {
                return NotFound(new { message = "Bài viết không tồn tại." });
            }
            return article;
        }

        [HttpPost("/api/Articles/upload-image/{id}")]
        public async Task<ActionResult<Article>> UploadArticleImage(int id, IFormFile imageFile)
        {
            try
            {
                // Gọi phương thức UploadArticleImageAsync từ ArticlesService
                var updatedArticle = await _articlesService.UploadArticleImageAsync(id, imageFile);

                // Trả về bài viết đã cập nhật với đường dẫn hình ảnh mới
                return Ok(updatedArticle);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}