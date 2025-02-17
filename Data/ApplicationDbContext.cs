using Microsoft.EntityFrameworkCore;
using PostalManagementAPI.Models;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Address> Addresses { get; set; }
    public DbSet<Delivery> Deliveries{ get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Office> Offices { get; set; }
    public DbSet<PackageHolder> PackageHolders { get; set; }
    public DbSet<TrackingHistory> TrackingHistories { get; set; }
    public DbSet<UserAddress> UserAdresses { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<EmployeeOffice> EmployeeOffices { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Address>()
            .HasKey(a => a.Id);
        modelBuilder.Entity<Delivery>()
            .HasKey(d => d.Id);
        modelBuilder.Entity<Employee>();
        modelBuilder.Entity<Office>()
             .HasKey(o => o.Id);
        modelBuilder.Entity<PackageHolder>()
            .HasKey(p => p.Id);
        modelBuilder.Entity<TrackingHistory>();
        modelBuilder.Entity<UserAddress>()
            .HasKey(a => a.Id);
        modelBuilder.Entity<User>();
    }
}
