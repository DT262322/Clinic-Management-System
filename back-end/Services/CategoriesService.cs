using back_end.Data;
using back_end.Models;

namespace back_end.Services;

public class CategoriesService
{
    private readonly DataContext _context;

    public CategoriesService(DataContext context)
    {
        _context = context;
    }

    public List<Category> GetAllCategories()
    {
        return _context.Categories.ToList();
    }

    public Category GetCategoryById(int id)
    {
        return _context.Categories.Find(id);
    }

    public void AddCategory(Category category)
    {
        _context.Categories.Add(category);
        _context.SaveChanges();
    }

    public void UpdateCategory(Category category)
    {
        _context.Categories.Update(category);
        _context.SaveChanges();
    }
    //Delete ơ đây là đổi trạng thái của stas
    public void ChangeStatus(int id)
    {
        var category = _context.Categories.Find(id);
        if (category != null)
        {
            category.Status = false; // Cập nhật status = false
            _context.Categories.Update(category);
            _context.SaveChanges();
        }
    }
    //Hàm kiêm tra category có tồn tại ko
    public bool CategoryExists(int id)
    {
        return _context.Categories.Any(e => e.Id == id);
    }
}