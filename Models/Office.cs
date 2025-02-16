using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PostalManagementAPI.Models
{
    [Table("tbl_offices")]
    public class Office
    {
        [Key]
        public int Id { get; set; } 
        public string Name { get; set; }
        [ForeignKey("Address")]
        public int AddressId { get; set; }
        public string Phone { get; set; }
        public string Type { get; set; }
    }
}
