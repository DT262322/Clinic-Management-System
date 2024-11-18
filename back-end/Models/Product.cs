using System.ComponentModel.DataAnnotations;

namespace back_end.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public int Stock { get; set; }
        public string Unit { get; set; }
        public long Price { get; set; }
        public string ImageName { get; set; }
        public DateTime Warranty { get; set; }
        public string Component { get; set; }
        public string Usage { get; set; }
        public string Dosage { get; set; }
        public string SideEffects { get; set; }
        public string Storage { get; set; }
        public string Description { get; set; }
        public bool Status { get; set; }

        public int BrandId { get; set; }
        public Brand Brand { get; set; }

        public int CategoryId { get; set; }
        public Category Category { get; set; }

        
        public Product()
        {
            Stock = 0;
            Unit = "Chưa nhập";
            Price = 0;
            ImageName = string.Empty;
            Warranty = DateTime.MinValue;
            Component = string.Empty;
            Usage = string.Empty;
            Dosage = string.Empty;
            SideEffects = string.Empty;
            Storage = string.Empty;
            Description = string.Empty;
            Status = false;
            BrandId = 46;
            CategoryId = 16;

        }

        public string GetFileName()
        {
            if (!string.IsNullOrEmpty(this.ImageName)) return "";
            return $"https://project-sem3-2024.s3.ap-southeast-1.amazonaws.com/{this.ImageName}";
        }
    }
}