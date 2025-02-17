using App.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PostalManagementAPI.DTOs;
using PostalManagementAPI.Models;
using PostalManagementAPI.Services;
using System.Security.Claims;

namespace PostalManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DeliveryController : ControllerBase
    {
        private readonly DeliveryService _deliveryService;
        private readonly AddressService _addressService;
        private readonly PackageHolderService _packageHolderService;
        private readonly TrackingHistoryService _trackingHistoryService;
        private readonly OfficeService _officeService;
        private readonly EmailService _emailService;
        private readonly UserService _userService;

        public DeliveryController(
            DeliveryService deliveryService,
            AddressService addressService,
            PackageHolderService packageHolderService,
            TrackingHistoryService trackingHistoryService,
            OfficeService officeService,
            EmailService emailService,
            UserService userService)
        {
            _deliveryService = deliveryService;
            _addressService = addressService;
            _packageHolderService = packageHolderService;
            _trackingHistoryService = trackingHistoryService;
            _officeService = officeService;
            _emailService = emailService;
            _userService = userService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var identityId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            var userId = await _userService.GetUserIdByIdentityIdAsync(identityId);

            List<Delivery> deliveries = role switch
            {
                "admin" => await _deliveryService.GetAllAsync(),
                "employee" => await _deliveryService.GetByHolderIdAndTypeAsync(userId, "office"),
                _ => await _deliveryService.GetByUserAsync(userId)
            };

            return Ok(deliveries);
        }

        [Authorize]
        [HttpGet("{trackingNumber}")]
        public async Task<IActionResult> GetByTrackingNumber(string trackingNumber)
        {
            var delivery = await _deliveryService.GetByTrackingNumberAsync(trackingNumber);
            if (delivery == null) return NotFound();
            return Ok(delivery);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create(Delivery delivery)
        {
            var identityId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userId = await _userService.GetUserIdByIdentityIdAsync(identityId);

            if (string.IsNullOrEmpty(identityId))
            {
                return Unauthorized("Unauthorized to create this delivery.");
            }

            //var recipient = await _packageHolderService.GetPackageHolderByEmail(delivery.RecipientEmail);

            //if (recipient == null)
            //{
            //    string password = Helpers.GenerateRandomString(8);

            //    await _emailService.SendEmailAsync(delivery.RecipientEmail, "Welcome to our service",
            //        $"Hello {delivery.RecipientFirstName},\n\nYour temporary password: {password}");

            //    recipient = await _packageHolderService.GetPackageHolderByEmail(delivery.RecipientEmail);
            //}

            var recipientAddress =  await _addressService.CreateAsync(new Address
                                   {
                                       City = delivery.RecipientCity,
                                       Street = delivery.RecipientStreet,
                                       Zip = delivery.RecipientZipCode,
                                   });

            var senderAddress = await _addressService.GetByUserIdAsync(userId);
            var offices = await _officeService.GetAllAsync();

            var chosenOffice = offices
                .Select(office => new
                {
                    Office = office,
                    Distance = Helpers.CalculateDistance($"{senderAddress.Street} {senderAddress.City}",
                                                         $"{office.Address.Street} {office.Address.City}")
                })
                .OrderBy(o => o.Distance)
                .First()
                .Office;

            delivery.SenderId = userId;
            delivery.OfficeId = chosenOffice.Id;

            var createdDelivery = await _deliveryService.CreateAsync(delivery);

            await _trackingHistoryService.CreateAsync(new TrackingHistory
            {
                DeliveryId = createdDelivery.Id,
                HolderId = (int)delivery.SenderId,
                Description = "Dërgesa u krijua",
                Status = "created",
                CreatedAt = DateTime.UtcNow
            });

            return CreatedAtAction(nameof(GetByTrackingNumber), new { trackingNumber = createdDelivery.TrackingNumber }, createdDelivery);
        }

        [Authorize(Roles = "courier, employee")]
        [HttpPost("{id}/accept")]
        public async Task<IActionResult> Accept(int id)
        {
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;

            var delivery = await _deliveryService.GetByIdAsync(id);
            if (delivery == null) return NotFound();

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            string newStatus = delivery.Status switch
            {
                "created" when role == "courier" => "accepted",
                "accepted" when role == "courier" => "picked_up",
                "picked_up" when role == "employee" => "in_post_office",
                "in_post_office" when role == "courier" => "out_for_delivery",
                "out_for_delivery" when delivery.RecipientEmail.ToString() == userEmail => "delivered",
                _ => delivery.Status
            };

            if (newStatus == delivery.Status)
                return BadRequest("Invalid status transition.");

            await _trackingHistoryService.CreateAsync(new TrackingHistory
            {
                DeliveryId = delivery.Id,
                HolderId = int.Parse(userId),
                Description = $"Status updated to {newStatus}",
                Status = newStatus,
                CreatedAt = DateTime.UtcNow
            });

            await _deliveryService.UpdateStatusAsync(delivery.Id, newStatus);
            return Ok(delivery);
        }
    }
}
