using Microsoft.EntityFrameworkCore;

public class PackageHolderService
{
    private readonly ApplicationDbContext _context;

    public PackageHolderService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PackageHolder?> GetByIdentityIdAsync(int identityId)
    {
        return await _context.PackageHolders
            .Where(ph => ph.IdentityId == identityId && (ph.Type == "user" || ph.Type == "courier"))
            .FirstOrDefaultAsync();
    }

    public async Task<PackageHolder?> GetByOfficeIdAsync(int officeId)
    {
        return await _context.PackageHolders
            .Where(ph => ph.OfficeId == officeId && ph.Type == "office")
            .FirstOrDefaultAsync();
    }

    public async Task<PackageHolder> CreateAsync(PackageHolder packageHolder)
    {
        _context.PackageHolders.Add(packageHolder);
        await _context.SaveChangesAsync();
        return packageHolder;
    }

    public async Task<PackageHolder?> UpdateAsync(int id, PackageHolder updatedPackageHolder)
    {
        var packageHolder = await _context.PackageHolders.FindAsync(id);
        if (packageHolder == null)
        {
            return null;
        }

        packageHolder.IdentityId = updatedPackageHolder.IdentityId;
        packageHolder.OfficeId = updatedPackageHolder.OfficeId;
        packageHolder.Type = updatedPackageHolder.Type;

        _context.PackageHolders.Update(packageHolder);
        await _context.SaveChangesAsync();
        return packageHolder;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var packageHolder = await _context.PackageHolders.FindAsync(id);
        if (packageHolder == null)
        {
            return false;
        }

        _context.PackageHolders.Remove(packageHolder);
        await _context.SaveChangesAsync();
        return true;
    }
}