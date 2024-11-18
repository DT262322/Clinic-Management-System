using Microsoft.EntityFrameworkCore;

namespace back_end.Models
{
    public class OrderDetail
    {
        public int Id { get; set; }
        public int Quantity { get; set; }
        public long UnitPrice { get; set; }

        public int ProductId { get; set; }
        [DeleteBehavior(DeleteBehavior.NoAction)]
        public Product Product { get; set; }

        public int OrderId { get; set; }
        [DeleteBehavior(DeleteBehavior.NoAction)]
        public Order Order { get; set; }
    }
}
