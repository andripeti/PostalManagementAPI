using Microsoft.EntityFrameworkCore;
using PostalManagementAPI.Models;

namespace PostalManagementAPI.Services
{
    public class OfficeService
    {
        private readonly ApplicationDbContext _context;

        public OfficeService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Office?> GetByIdAsync(int id)
        {
            return await _context.Offices
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<Office> CreateAsync(Office office)
        {
            _context.Offices.Add(office);
            await _context.SaveChangesAsync();
            return office;
        }

        public async Task<Office?> UpdateAsync(int id, Office updatedOffice)
        {
            var office = await _context.Offices.FindAsync(id);
            if (office == null)
            {
                return null;
            }

            office.Name = updatedOffice.Name;
            office.AddressId = updatedOffice.AddressId;

            _context.Offices.Update(office);
            await _context.SaveChangesAsync();

            return office;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var office = await _context.Offices.FindAsync(id);
            if (office == null)
            {
                return false;
            }

            _context.Offices.Remove(office);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Office>> GetAllAsync()
        {
            return await _context.Offices.ToListAsync();
        }
    }
}
