using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PostalManagementAPI.Models
{
    [Table("tbl_deliveries")]
    public class Delivery
    {
        [Key]
        public int Id { get; set; }

        // Sender Information
        public int? SenderId { get; set; }
        public string SenderName { get; set; }
        public string SenderPhone { get; set; }
        public string SenderEmail { get; set; }
        public string SenderStreet { get; set; }
        public string SenderCity { get; set; }
        public string SenderState { get; set; }
        public string SenderCountry { get; set; }
        public string SenderZipCode { get; set; }

        // Recipient Information
        public string ReciepientName { get; set; }
        public string RecipientPhone { get; set; }
        public string RecipientEmail { get; set; }
        public string RecipientStreet { get; set; }
        public string RecipientCity { get; set; }
        public string RecipientState { get; set; }
        public string RecipientCountry { get; set; }
        public string RecipientZipCode { get; set; }

        // Package Information
        public string PackageType { get; set; }
        public float PackageWeight { get; set; }
        public float PackageLength { get; set; }
        public float PackageWidth { get; set; }
        public float PackageHeight { get; set; }

        // Delivery Status & Notes
        public int OfficeId { get; set; }
        public int HolderId { get; set; }
        public string Notes { get; set; } = string.Empty;
        public string Status { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string TrackingNumber { get; set; } = string.Empty;

        // Tracking History
        public virtual ICollection<TrackingHistory> TrackingHistories { get; set; } = new List<TrackingHistory>();
    }
}
