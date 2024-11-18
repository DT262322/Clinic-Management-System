using back_end.Data;
using back_end.Models;

namespace back_end.Services;

public class BrandsService
{
    private readonly DataContext _context;

    public BrandsService(DataContext context)
    {
        _context = context;
    }
    public List<Brand> GetAllBrands()
    {
        return _context.Brands.ToList();
    }
    public Brand GetBrandById(int id)
    {
        return _context.Brands.Find(id);
    }
    public void AddBrand(Brand brand)
    {
        _context.Brands.Add(brand);
        _context.SaveChanges();
    }
    public void UpdateBrand(Brand brand)
    {
        if (brand == null)
        {
            throw new ArgumentNullException(nameof(brand), "Thương hiệu không được null");
        }

        if (!BrandExits(brand.Id))
        {
            throw new KeyNotFoundException("Thương hiệu không tồn tại");
        }

        _context.Brands.Update(brand);
        _context.SaveChanges();
    }
    public void ChangeStatus(int id)
    {
        var brand = _context.Brands.Find(id);
        if (brand == null)
        {
            throw new KeyNotFoundException("Thương hiệu không tồn tại");
        }

        brand.Status = false;
        _context.Brands.Update(brand);
        _context.SaveChanges();
    }
    //Hàm kiêm tra brand có tồn tại ko
    public bool BrandExits(int id)
    {
        return _context.Brands.Any(e => e.Id == id);
    }

}