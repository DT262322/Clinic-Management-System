namespace back_end.Models
{
    public class Cart
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public long UnitPrice { get; set; }
        public long Total { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; }

        public string UserId { get; set; }
        public User User { get; set; }
    }
}