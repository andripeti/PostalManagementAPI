using PostalManagementAPI.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace PostalManagementAPI.Services
{
    public class UserService
    {
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User> GetUserByIdentityIdAsync(string identityId)
        {
            return await _context.Users
                .Where(u => u.IdentityId == identityId)
                .FirstOrDefaultAsync();
        }

        public async Task<int> GetUserIdByIdentityIdAsync(string identityId)
        {
            var user = await GetUserByIdentityIdAsync(identityId); // Await the asynchronous call
            return user.Id; // Return the Id
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            return await _context.Users
                .Where(u => u.Id == id)
                .FirstOrDefaultAsync();
        }

        // Method to create a new user
        public async Task<User> CreateUserAsync(string identityId)
        {
            var newUser = new User
            {
                IdentityId = identityId
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return newUser; // Return the newly created user
        }

        // Method to update a user's IdentityId (if needed)
        public async Task<User> UpdateUserIdentityIdAsync(int id, string newIdentityId)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                user.IdentityId = newIdentityId;
                await _context.SaveChangesAsync();
            }

            return user;
        }

        // Method to check if a user exists by their IdentityId
        public async Task<bool> UserExistsAsync(string identityId)
        {
            return await _context.Users
                .AnyAsync(u => u.IdentityId == identityId);
        }
    }
}
