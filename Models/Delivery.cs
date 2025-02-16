using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PostalManagementAPI.Models
{
    [Table("tbl_deliveries")]
    public class Delivery
    {
        [Key]
        public int Id { get; set; }
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public int HolderId { get; set; }
        public int OfficeId { get; set; }
        public int AddressId { get; set; }
        public string Notes { get; set; } = string.Empty;
        public string Status { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string TrackingNumber { get; set; } = string.Empty;

        public virtual ICollection<TrackingHistory> TrackingHistories { get; set; } = new List<TrackingHistory>();
    }
}
