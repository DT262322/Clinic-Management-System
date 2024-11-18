using back_end.Models;
using back_end.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrandsController : ControllerBase
    {
        private readonly BrandsService _brandsService;

        public BrandsController(BrandsService brandsService)
        {
            _brandsService = brandsService;
        }

        // GET: api/Brands
        [HttpGet]
        public ActionResult<IEnumerable<Brand>> GetBrands()
        {
            var brandsList = _brandsService.GetAllBrands();
            return brandsList.ToList();
        }

        // GET: api/Brands/5
        [HttpGet("{id}")]
        public ActionResult<Brand> GetBrand(int id)
        {
            var brand = _brandsService.GetBrandById(id);

            if (brand == null)
            {
                return NotFound();
            }

            return brand;
        }

        // PUT: api/Brands/5
        [HttpPut("{id}")]
        public IActionResult PutBrand(int id, Brand brand)
        {
            if (id != brand.Id)
            {
                return BadRequest();
            }

            try
            {
                _brandsService.UpdateBrand(brand);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_brandsService.BrandExits(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Brands
        [HttpPost]
        public ActionResult<Brand> AddBrand(Brand brand)
        {
            _brandsService.AddBrand(brand);

            return CreatedAtAction("GetBrand", new { id = brand.Id }, brand);
        }

        // DELETE: api/Brands/5
        [HttpDelete("{id}")]
        public IActionResult DeleteBrand(int id)
        {
            var brand = _brandsService.GetBrandById(id);
            if (brand == null)
            {
                return NotFound();
            }

            _brandsService.ChangeStatus(id);

            return NoContent();
        }
    }
}
