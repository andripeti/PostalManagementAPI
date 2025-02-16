using Microsoft.EntityFrameworkCore;
using PostalManagementAPI.Models;

namespace PostalManagementAPI.Services
{
    public class AddressService
    {
        private readonly ApplicationDbContext _context;

        public AddressService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Address?> GetByIdAsync(int id)
        {
            return await _context.Addresses.FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<Address?> GetByUserIdAsync(int userId)
        {
            var userAddress = await _context.UserAdresses
                .FirstOrDefaultAsync(ua => ua.UserId == userId);

            if (userAddress == null)
            {
                return null;
            }

            return await _context.Addresses
                .FirstOrDefaultAsync(a => a.Id == userAddress.AddressId);
        }

        public async Task<Address> CreateAsync(Address address)
        {
            _context.Addresses.Add(address);
            await _context.SaveChangesAsync();
            return address;
        }

        public async Task<Address> UpdateByIdentityIdAsync(Address newAddress)
        {
            var existingAddress = await GetByUserIdAsync(newAddress.UserId);

            if (existingAddress == null)
            {
                return await CreateAsync(newAddress);
            }

            existingAddress.Street = newAddress.Street;
            existingAddress.City = newAddress.City;
            existingAddress.Zip = newAddress.Zip;

            _context.Addresses.Update(existingAddress);
            await _context.SaveChangesAsync();
            return existingAddress;
        }
    }
}
