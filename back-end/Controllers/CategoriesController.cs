using back_end.Models;
using back_end.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly CategoriesService _categoriesService;

        public CategoriesController(CategoriesService categoriesService)
        {
            _categoriesService = categoriesService;
        }
        // GET: api/Categories
        [HttpGet]
        public ActionResult<IEnumerable<Category>> GetCategories()
        {
            var categoriesList = _categoriesService.GetAllCategories();
            return categoriesList.ToList();
        }
        // GET: api/Categories/5
        [HttpGet("{id}")]
        public ActionResult<Category> GetCategory(int id)
        {
            var category = _categoriesService.GetCategoryById(id);

            if (category == null)
            {
                return NotFound();
            }

            return category;
        }
        // PUT: api/Categories/5
        [HttpPut("{id}")]
        public IActionResult PutCategory(int id, Category category)
        {
            if (id != category.Id)
            {
                return BadRequest();
            }

            try
            {
                _categoriesService.UpdateCategory(category);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_categoriesService.CategoryExists(id))
                {
                    return NotFound();
                }
               
            }

            return NoContent();
        }
        // POST: api/Categories
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public ActionResult<Category> AddCategory(Category category)
        {
            _categoriesService.AddCategory(category);

            return CreatedAtAction("GetCategory", new { id = category.Id }, category);
        }


        // DELETE: api/Categories/5
        [HttpDelete("{id}")]
        public IActionResult DeleteCategory(int id)
        {
            var category = _categoriesService.GetCategoryById(id);
            if (category == null)
            {
                return NotFound();
            }

            _categoriesService.ChangeStatus(id);

            return NoContent();
        }
    }

}