using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PostalManagementAPI.Models
{
    [Table("tbl_user_addresses")]
    public class UserAddress
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        [ForeignKey("Address")]
        public int AddressId { get; set; }
    }
}
