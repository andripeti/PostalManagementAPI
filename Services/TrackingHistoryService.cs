using Microsoft.EntityFrameworkCore;
using PostalManagementAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PostalManagementAPI.Services
{
    public class TrackingHistoryService
    {
        private readonly ApplicationDbContext _context;

        public TrackingHistoryService(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get tracking history by delivery ID
        public async Task<List<TrackingHistory>> GetByDeliveryIdAsync(int deliveryId)
        {
            return await _context.TrackingHistories
                .Where(t => t.DeliveryId == deliveryId)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        // Get the latest tracking history by delivery ID
        public async Task<TrackingHistory?> GetLatestByDeliveryIdAsync(int deliveryId)
        {
            return await _context.TrackingHistories
                .Where(t => t.DeliveryId == deliveryId)
                .OrderByDescending(t => t.CreatedAt)
                .FirstOrDefaultAsync();
        }

        // Create new tracking history record
        public async Task<TrackingHistory> CreateAsync(TrackingHistory trackingHistory)
        {
            _context.TrackingHistories.Add(trackingHistory);
            await _context.SaveChangesAsync();
            return trackingHistory;
        }
    }
}
