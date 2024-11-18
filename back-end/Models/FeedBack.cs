namespace back_end.Models
{
    public class FeedBack
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedDate { get; set; }

        public string UserId { get; set; }
        public User User { get; set; }
    }
}