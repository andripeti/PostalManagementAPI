using System.ComponentModel.DataAnnotations.Schema;

namespace PostalManagementAPI.Models
{
    [Table("tbl_tracking_histories")]
    public class TrackingHistory
    {
        public int Id { get; set; }
        [ForeignKey("Delivery")]
        public int DeliveryId { get; set; }
        [ForeignKey("User")]
        public int HolderId { get; set; } 
        public string Description { get; set; }  
        public string Status { get; set; }   
        public DateTime CreatedAt { get; set; } 
    }
}
