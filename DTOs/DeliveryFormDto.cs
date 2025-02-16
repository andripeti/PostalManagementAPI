namespace PostalManagementAPI.DTOs
{
    public class DeliveryFormDto
    {
        public string? RecipientFirstName { get; set; }
        public string? RecipientLastName { get; set; }
        public string? RecipientEmail { get; set; }
        public string? RecipientAddressStreet { get; set; }
        public string? RecipientAddressCity { get; set; }
        public string? RecipientAddressZipCode { get; set; }
        public int SenderId { get; set; }
        public int HolderId { get; set; }
        public int RecipientId { get; set; }
    }
}
