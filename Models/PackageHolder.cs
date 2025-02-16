using System.ComponentModel.DataAnnotations.Schema;

[Table("tbl_package_holders")]
public class PackageHolder
{
    public int Id { get; set; }
    public int? IdentityId { get; set; }
    public int? OfficeId { get; set; }
    public string Type { get; set; }
}
