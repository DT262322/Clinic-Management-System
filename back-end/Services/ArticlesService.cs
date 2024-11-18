using back_end.Data;
using back_end.Models;

namespace back_end.Services;

public class ArticlesService
{
    private readonly DataContext _context;
    private readonly IWebHostEnvironment _webHostEnvironment;
    private readonly S3Service _s3Service;
    public ArticlesService(DataContext context, IWebHostEnvironment webHostEnvironment, S3Service s3Service)
    {
        _context = context;
        _webHostEnvironment = webHostEnvironment;
        _s3Service = s3Service;
    }

    // Lấy ra tất cả article trên trang admin
    public List<Article> GetAllArticleForAdmin()
    {
        return _context.Articles.ToList();
    }

    // Lấy ra tất cả article trên trang user ( với status == true )
    public List<Article> GetAllArticleForUser()
    {
        return _context.Articles
            .Where(a => a.Status == true)
            .ToList();
    }

    // Lấy article theo Id
    public Article GetArticleByIdForAdmin(int id)
    {
        return _context.Articles.Find(id);
    }
    public Article GetArticleByIdForUser(int id)
    {
        return _context.Articles
            .FirstOrDefault(p => p.Id == id && p.Status == true);
    }

    // Thêm article ( với ngày hôm nay ) và trả về article vừa thêm
    public Article AddArticle(Article article)
    {
        try
        {
            var now = DateTime.Now;
            article.UpdatedDate = now;
            article.CreatedDate = now;

            _context.Articles.Add(article);
            _context.SaveChanges();
            return article;
        }
        catch (Exception)
        {
            return null; // Hoặc có thể ném lỗi nếu cần
        }
    }

    // Xóa article (chuyển status sang false) và trả về kết quả bool
    public bool DeleteArticle(int id)
    {
        var article = _context.Articles.Find(id);
        if (article == null)
        {
            return false; // Bài viết không tồn tại
        }

        article.Status = false;
        _context.Articles.Update(article);
        _context.SaveChanges();
        return true; // Xóa thành công (thực chất là ẩn bài viết)
    }

    // Cập nhật article và trả về article đã cập nhật
    public Article UpdateArticle(Article article)
    {
        // Kiểm tra bài viết có tồn tại hay không
        var existingArticle = _context.Articles.Find(article.Id);
        if (existingArticle == null)
        {
            return null; // Bài viết không tồn tại
        }

        // Cập nhật các thuộc tính của bài viết
        existingArticle.Title = article.Title;
        existingArticle.Summary = article.Summary;
        existingArticle.Content = article.Content;
        existingArticle.ImageName = article.ImageName;
        existingArticle.Status = article.Status;
        existingArticle.UpdatedDate = DateTime.Now;

        _context.Articles.Update(existingArticle);
        _context.SaveChanges();
        return existingArticle; // Trả về bài viết đã cập nhật
    }

    // Kiểm tra xem bài viết có tồn tại không và trả về bool
    public bool ArticleExists(int id)
    {
        return _context.Articles.Any(a => a.Id == id);
    }

    // Upload hình ảnh cho Article
    public async Task<Article> UploadArticleImageAsync(int articleId, IFormFile imageFile)
    {
        // Kiểm tra tệp hình ảnh
        if (imageFile == null || imageFile.Length == 0)
        {
            throw new ArgumentException("File ảnh không hợp lệ.");
        }

        // Tìm bài viết theo ID
        var article = await _context.Articles.FindAsync(articleId);
        if (article == null)
        {
            throw new Exception("Bài viết không tồn tại.");
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

        // Cập nhật thuộc tính ImageName trong Article
        article.ImageName = newFileName;
        _context.Articles.Update(article);
        await _context.SaveChangesAsync(); // Lưu thay đổi một cách async

        return article;
    }


}
