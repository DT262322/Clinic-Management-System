namespace back_end.Models
{
    public class Image
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public string ImageDescription { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; }
    }
}