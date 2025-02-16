using System.ComponentModel.DataAnnotations;

namespace PostalManagementAPI.Models
{
    public class Vehicle
    {
        [Key]
        public int Id { get; set; }
        public string Make { get; set; }
        public string Model { get; set; }
        public string Type { get; set; }
        public string Plate { get; set; }
        public string Vin { get; set; }
    }
}
