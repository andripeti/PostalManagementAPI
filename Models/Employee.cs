using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PostalManagementAPI.Models
{
    [Table("tbl_employees")]
    public class Employee
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string IdentityId { get; set; } 
        public int Salary { get; set; }
    }
}
