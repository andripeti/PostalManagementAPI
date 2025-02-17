using System.ComponentModel.DataAnnotations;

namespace PostalManagementAPI.DTOs
{
    public class DeliveryFormDto
    {
        // Sender Information (Provided by user)
        [Required] public string SenderName { get; set; }
        [Required] public string SenderPhone { get; set; }
        [Required] public string SenderEmail { get; set; }
        public string SenderStreet { get; set; }
        public string SenderCity { get; set; }
        public string SenderState { get; set; }
        public string SenderCountry { get; set; }
        public string SenderZipCode { get; set; }

        // Recipient Information
        [Required] public string RecipientName { get; set; }
        [Required] public string RecipientPhone { get; set; }
        [Required] public string RecipientEmail { get; set; }
        [Required] public string RecipientStreet { get; set; }
        [Required] public string RecipientCity { get; set; }
        public string RecipientState { get; set; }
        public string RecipientCountry { get; set; }
        [Required] public string RecipientZipCode { get; set; }

        // Package Information
        [Required] public string PackageType { get; set; }
        [Required] public float PackageWeight { get; set; }
        public float PackageLength { get; set; }
        public float PackageWidth { get; set; }
        public float PackageHeight { get; set; }

        // Notes (Optional)
        public string Notes { get; set; }
    }
}
