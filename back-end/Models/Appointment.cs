namespace back_end.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        public DateTime AppointmentDate { get; set; }
        public bool Status { get; set; }
        public string Description { get; set; }
        
        public int ServiceId { get; set; }
        public Service Service { get; set; }
        
        public string UserId { get; set; }
        public User User { get; set; }

        public Appointment()
        {
            Status = false;
            Description = "";
        }
    }
}
