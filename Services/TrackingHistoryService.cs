﻿using Microsoft.EntityFrameworkCore;
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

        public async Task<List<TrackingHistory>> GetByDeliveryIdAsync(int deliveryId)
        {
            return await _context.TrackingHistories
                .Where(t => t.DeliveryId == deliveryId)
                .OrderByDescending(t => t.CreatedAt)
                .ToListAsync();
        }

        public async Task<TrackingHistory?> GetLatestByDeliveryIdAsync(int deliveryId)
        {
            return await _context.TrackingHistories
                .Where(t => t.DeliveryId == deliveryId)
                .OrderByDescending(t => t.CreatedAt)
                .FirstOrDefaultAsync();
        }

        public async Task<TrackingHistory> CreateAsync(TrackingHistory trackingHistory)
        {
            _context.TrackingHistories.Add(trackingHistory);
            await _context.SaveChangesAsync();
            return trackingHistory;
        }
    }
}
