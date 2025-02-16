using Microsoft.EntityFrameworkCore;
using PostalManagementAPI.Models;

namespace PostalManagementAPI.Services
{
    public class EmployeeService
    {
        private readonly ApplicationDbContext _context;

        public EmployeeService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Employee?> GetByIdentityIdAsync(string identityId)
        {
            return await _context.Employees
                .FirstOrDefaultAsync(e => e.IdentityId == identityId);
        }
    }
}
