using back_end.Data;
using back_end.Models;
using back_end.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace back_end.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class AppointmentsController : ControllerBase
    {

        private readonly DataContext _context;
        private readonly AppointmentsService _appointmentsService;

        public AppointmentsController(DataContext context, AppointmentsService appointmentsService)
        {
            _context = context;
            _appointmentsService = appointmentsService;
        }

        // ---------------------- API cho Admin ----------------------

        [HttpGet("/api/admin/Appointments")]
        public ActionResult<IEnumerable<Appointment>> GetAllAppointmentForAdmin()
        {
            var appointmentAdmin = _appointmentsService.GetAllAppointmentForAdmin();
            return Ok(appointmentAdmin);

        }

        //Chỉnh sửa trạng thái lịch hẹn sang true
        [HttpPut("/api/admin/Appointments/update-status/{id}")]
        public ActionResult UpdateAppointmentStatus(int id)
        {
            try
            {
                _appointmentsService.DeleteAppointment(id);
                return Ok(new { message = "Appointment status updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // ---------------------- API cho User ----------------------


        [HttpGet("/api/Appointments")]
        public ActionResult<IEnumerable<Appointment>> GetAllAppointmentForUser(string userId)
        {
            var appointmentUser = _appointmentsService.GetAllAppointmentForUser(userId);
            if (appointmentUser == null)
            {
                Console.WriteLine($"Người dùng có id là {userId} không có lịch hẹn");
                throw new Exception($"Người dùng có id là {userId} không có lịch hẹn");
            }
            return Ok(appointmentUser);
        }

        [HttpPost("/api/Appointments/add")]
        public ActionResult AddAppointment(Appointment appointment)
        {
            try
            {
                _appointmentsService.AddAppointment(appointment);
                return Ok(new { message = "Đã đặt lịch hẹn thành công" });

            }
            catch (Exception ex)
            {

                return BadRequest(new { message = ex.Message });
            }

        }

    }
}
