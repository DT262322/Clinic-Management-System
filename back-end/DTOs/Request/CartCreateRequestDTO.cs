namespace back_end.DTOs.Request
{
    public class CartCreateRequestDTO
    {
        public string UserId { get; set; }
        public int productId { get; set;}

        public int quantity { get; set;}
    }
}
