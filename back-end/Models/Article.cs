namespace back_end.Models
{
    public class Article
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Summary { get; set; }
        public string Content { get; set; }
        public string ImageName { get; set; }
        public bool Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public User User { get; set; }
        public string UserId { get; set; }

        // Constructor to initialize default values
        public Article()
        {
            Title = string.Empty;
            Summary = string.Empty;
            Content = string.Empty;
            ImageName = string.Empty;
            Status = true; // Assuming true is the default status
            CreatedDate = DateTime.Now;
            UpdatedDate = DateTime.Now;
          
        }

        // Overloaded constructor to allow setting some properties during initialization
        public Article(string title, string summary, string content, string imageName, bool status)
        {
            Title = title;
            Summary = summary;
            Content = content;
            ImageName = imageName;
            Status = status;
            CreatedDate = DateTime.Now;
            UpdatedDate = DateTime.Now;
           
        }
    }
}
