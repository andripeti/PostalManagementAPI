using Microsoft.EntityFrameworkCore;

public class PackageHolderService
{
    private readonly ApplicationDbContext _context;

    public PackageHolderService(ApplicationDbContext context)
    {
        _context = context;
    }

    // Method to get PackageHolder by IdentityId
    public async Task<PackageHolder?> GetByIdentityIdAsync(int identityId)
    {
        return await _context.PackageHolders
            .Where(ph => ph.IdentityId == identityId && (ph.Type == "user" || ph.Type == "courier"))
            .FirstOrDefaultAsync();
    }

    // Method to get PackageHolder by OfficeId
    public async Task<PackageHolder?> GetByOfficeIdAsync(int officeId)
    {
        return await _context.PackageHolders
            .Where(ph => ph.OfficeId == officeId && ph.Type == "office")
            .FirstOrDefaultAsync();
    }

    // Method to create a new PackageHolder
    public async Task<PackageHolder> CreateAsync(PackageHolder packageHolder)
    {
        _context.PackageHolders.Add(packageHolder);
        await _context.SaveChangesAsync();
        return packageHolder;
    }

    // Method to update an existing PackageHolder
    public async Task<PackageHolder?> UpdateAsync(int id, PackageHolder updatedPackageHolder)
    {
        var packageHolder = await _context.PackageHolders.FindAsync(id);
        if (packageHolder == null)
        {
            return null; // PackageHolder not found
        }

        packageHolder.IdentityId = updatedPackageHolder.IdentityId;
        packageHolder.OfficeId = updatedPackageHolder.OfficeId;
        packageHolder.Type = updatedPackageHolder.Type;

        _context.PackageHolders.Update(packageHolder);
        await _context.SaveChangesAsync();
        return packageHolder;
    }

    // Method to delete a PackageHolder
    public async Task<bool> DeleteAsync(int id)
    {
        var packageHolder = await _context.PackageHolders.FindAsync(id);
        if (packageHolder == null)
        {
            return false; // PackageHolder not found
        }

        _context.PackageHolders.Remove(packageHolder);
        await _context.SaveChangesAsync();
        return true;
    }
}