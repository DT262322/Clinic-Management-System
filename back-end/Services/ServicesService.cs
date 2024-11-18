using back_end.Models;
using back_end.Data;

namespace back_end.Services
{
    public class ServicesService
    {
        private readonly DataContext _context;

        public ServicesService(DataContext context)
        {
            _context = context;
        }

        // Dành cho admin
        public List<Service> GetAllServicesForAdmin()
        {
            return _context.Services.ToList();
        }

        public Service GetServiceById(int id)
        {
            return _context.Services.Find(id);
        }

        public void AddService(Service service)
        {
            _context.Services.Add(service);
            _context.SaveChanges();
        }

        public bool UpdateService(Service service)
        {
            var existingService = _context.Services.Find(service.Id);
            if (existingService == null) return false;

            existingService.Name = service.Name;
            existingService.Status = service.Status;
            _context.Services.Update(existingService);
            _context.SaveChanges();
            return true;
        }

        public bool DeleteService(int id)
        {
            var service = _context.Services.Find(id);
            if (service == null) return false;

            // Thay đổi status thành false
            service.Status = false;

            _context.Services.Update(service);
            _context.SaveChanges();
            return true;
        }

        // Dành cho user
        public List<Service> GetAllServicesForUser()
        {
            return _context.Services
                .Where(s => s.Status == true)
                .ToList();
        }
    }
}
