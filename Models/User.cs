using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PostalManagementAPI.Models
{
    [Table("tbl_users")]
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string IdentityId { get; set; }
    }
}