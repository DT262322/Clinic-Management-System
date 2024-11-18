using back_end.Models;
using back_end.Services;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly ServicesService _servicesService;

        public ServicesController(ServicesService servicesService)
        {
            _servicesService = servicesService;
        }

        // ----------- API Dành cho admin -----------

        // GET: api/Services/admin
        [HttpGet("/api/admin/Services")]
        public ActionResult<IEnumerable<Service>> GetServicesForAdmin()
        {
            var servicesAdmin = _servicesService.GetAllServicesForAdmin();
            if (servicesAdmin == null || servicesAdmin.Count == 0)
            {
                return NotFound("Không có dịch vụ.");
            }
            return Ok(servicesAdmin);
        }

        // POST: api/Services/admin
        [HttpPost("/api/admin/Services/add")]
        public ActionResult<Service> AddService(Service service)
        {
            _servicesService.AddService(service);
            return CreatedAtAction(nameof(GetServiceById), new { id = service.Id }, service);
        }

        // PUT: api/Services/admin/{id}
        [HttpPut("/api/admin/Services/edit/{id}")]
        public IActionResult UpdateService(int id, Service service)
        {
            if (id != service.Id)
            {
                return BadRequest("ID không khớp.");
            }

            var result = _servicesService.UpdateService(service);
            if (!result)
            {
                return NotFound("Dịch vụ không tồn tại.");
            }
            return NoContent();
        }

        // DELETE: api/Services/admin/{id}
        [HttpDelete("/api/admin/Services/delete/{id}")]
        public IActionResult DeleteService(int id)
        {
            var result = _servicesService.DeleteService(id);
            if (!result)
            {
                return NotFound("Dịch vụ không tồn tại.");
            }
            return NoContent();
        }

        // ----------- API Dành cho user -----------

        // GET: api/Services
        [HttpGet]
        public ActionResult<IEnumerable<Service>> GetServicesForUser()
        {
            var servicesUser = _servicesService.GetAllServicesForUser();
            if (servicesUser == null || servicesUser.Count == 0)
            {
                return NotFound("Không có dịch vụ.");
            }
            return Ok(servicesUser);
        }

        // GET: api/Services/{id}
        [HttpGet("{id}")]
        public ActionResult<Service> GetServiceById(int id)
        {
            var service = _servicesService.GetServiceById(id);

            if (service == null || !service.Status)
            {
                return NotFound("Dịch vụ không tồn tại hoặc không khả dụng.");
            }

            return Ok(service);
        }
    }
}
