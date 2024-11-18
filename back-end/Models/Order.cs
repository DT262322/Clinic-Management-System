namespace back_end.Models
{
    public class Order
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime DeliveryDate { get; set; }
        public DateTime PaymentDate { get; set; }
        public long Total { get; set; }
        public string PaymentMethod { get; set; }
        public bool Status { get; set; }

        public string UserId { get; set; }
        public User User { get; set; }


        public Order()
        {
            var now = DateTime.Now;
            PaymentMethod = "";
            OrderDate = now;
            PaymentDate = now;
        }
    }
}