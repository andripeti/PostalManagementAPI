using Microsoft.EntityFrameworkCore;
using PostalManagementAPI.Models;
using Microsoft.AspNetCore.Identity;

namespace PostalManagementAPI.Services
{
    public class DeliveryService
    {
        private readonly ApplicationDbContext _context;

        public DeliveryService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Delivery>> GetAllAsync()
        {
            var deliveries = await (from d in _context.Deliveries
                                    join i in _context.Users on d.HolderId equals i.Id
                                    select new
                                    {
                                        Delivery = d,
                                        ResponsiblePersonName = "Todo"
                                    }).ToListAsync();

            // Return the list of deliveries by selecting the 'Delivery' part of the anonymous type
            return deliveries.Select(d => d.Delivery).ToList();
        }

        public async Task<Delivery?> GetByTrackingNumberAsync(string trackingNumber)
        {
            return await _context.Deliveries.FirstOrDefaultAsync(d => d.TrackingNumber == trackingNumber);
        }

        public async Task<List<Delivery>> GetByHolderIdAsync(int holderId, string holderType)
        {
            IQueryable<Delivery> query = _context.Deliveries;

            if (holderType == "courier")
            {
                query = query.Where(d => d.HolderId == holderId || d.OfficeId == holderId);
            }
            else if (holderType == "office")
            {
                query = query.Where(d => d.OfficeId == holderId);
            }
            else
            {
                query = query.Where(d => d.HolderId == holderId);
            }

            return await query.ToListAsync();
        }

        public async Task<List<Delivery>> GetByUserAsync(int identityId)
        {
            return await _context.Deliveries
                .Where(d => d.SenderId == identityId || d.RecipientId == identityId)
                .Distinct()
                .ToListAsync();
        }

        public async Task<Delivery> CreateAsync(Delivery delivery)
        {
            _context.Deliveries.Add(delivery);
            await _context.SaveChangesAsync();

            delivery.TrackingNumber = delivery.Id.ToString("D10");
            _context.Deliveries.Update(delivery);
            await _context.SaveChangesAsync();

            return delivery;
        }

        public async Task<Delivery> UpdateAsync(int id, Delivery updatedDelivery)
        {
            var delivery = await _context.Deliveries.FindAsync(id);
            if (delivery == null)
            {
                return null;
            }

            delivery.HolderId = updatedDelivery.HolderId;
            delivery.Notes = updatedDelivery.Notes;

            _context.Deliveries.Update(delivery);
            await _context.SaveChangesAsync();

            return delivery;
        }

        public async Task DeleteAsync(int id)
        {
            var delivery = await _context.Deliveries.FindAsync(id);
            if (delivery == null)
            {
                return; 
            }

            _context.Deliveries.Remove(delivery);
            await _context.SaveChangesAsync();
        }

        public async Task<Delivery> GetByIdAsync(int id)
        {
            return await _context.Deliveries.FindAsync(id);
        }

        public async Task UpdateStatusAsync(int deliveryId, string newStatus)
        {
            var delivery = await _context.Deliveries.FindAsync(deliveryId);
            if (delivery == null) throw new KeyNotFoundException("Delivery not found.");

            delivery.Status = newStatus;
            delivery.UpdatedAt = DateTime.UtcNow;

            _context.Deliveries.Update(delivery);
            await _context.SaveChangesAsync();
        }
    }
}
