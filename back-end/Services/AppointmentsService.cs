using back_end.Data;
using back_end.Models;

namespace back_end.Services;

public class AppointmentsService
{
    private readonly DataContext _context;

    public AppointmentsService(DataContext context)
    {
        _context = context;
    }
    //lấy ra danh sách các lịch hẹn
    public List<Appointment> GetAllAppointmentForAdmin()
    {
        return _context.Appointments.ToList();
    }
    //lấy ra danh sách các lịch hẹn của user
    public List<Appointment> GetAllAppointmentForUser(string userId)
    {

        return _context.Appointments.Where(p => p.UserId == userId).ToList();
    }

    //Đặt lịch hẹn với userId
    public void AddAppointment(Appointment appointment)
    {

        _context.Appointments.Add(appointment);
        _context.SaveChanges();
    }

    //Chỉnh sửa trạng thái lich hẹn của khách hàng khi khách hàng đã tới phòng khám
    public void DeleteAppointment(int id)
    {
        var appointmentItem = _context.Appointments.Find(id);
        if (appointmentItem == null)
        {
            throw new Exception("Không tìm thấy lịch hẹn");
        }
        appointmentItem.Status = true;
        _context.Appointments.Update(appointmentItem);
        _context.SaveChanges();
    }
}