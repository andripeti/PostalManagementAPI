using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PostalManagementAPI.Models
{
    [Table("tbl_addresses")]
    public class Address
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Street { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string City { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Zip { get; set; } = string.Empty;

        public string Country { get; set; } = string.Empty;

        public string State {  get; set; } = string.Empty;

        public float Longitude { get; set; }
        public float Latitude { get; set; }
        public int UserId { get; set; }
    }
}
