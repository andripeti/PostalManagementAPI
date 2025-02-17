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
        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] DeliveryFormDto deliveryDto)
        {
            var identityId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(identityId))
            {
                return Unauthorized("Unauthorized to create this delivery.");
            }

            var userId = await _userService.GetUserIdByIdentityIdAsync(identityId);

            var recipientAddress = await _addressService.CreateAsync(new Address
            {
                City = deliveryDto.RecipientCity,
                Street = deliveryDto.RecipientStreet,
                Zip = deliveryDto.RecipientZipCode,
            });

            var senderAddress = await _addressService.GetByUserIdAsync(userId);
            if (senderAddress == null)
            {
                senderAddress = await _addressService.CreateAsync(new Address
                {
                    City = deliveryDto.SenderCity,
                    Street = deliveryDto.SenderStreet,
                    Zip = deliveryDto.SenderZipCode,
                });
            }

            //var offices = await _officeService.GetAllAsync();
            //var chosenOffice = offices
            //    .Select(office => new
            //    {
            //        Office = office,
            //        Distance = Helpers.CalculateDistance($"{senderAddress.Street} {senderAddress.City}",
            //                                             $"{office.Address.Street} {office.Address.City}")
            //    })
            //    .OrderBy(o => o.Distance)
            //    .First()
            //    .Office;

            // Create Delivery object to save in database
            var delivery = new Delivery
            {
                SenderId = userId,
                SenderName = deliveryDto.SenderName,
                SenderPhone = deliveryDto.SenderPhone,
                SenderEmail = deliveryDto.SenderEmail,
                SenderStreet = deliveryDto.SenderStreet,
                SenderCity = deliveryDto.SenderCity,
                SenderState = deliveryDto.SenderState,
                SenderCountry = deliveryDto.SenderCountry,
                SenderZipCode = deliveryDto.SenderZipCode,

                ReciepientName = deliveryDto.RecipientName,
                RecipientPhone = deliveryDto.RecipientPhone,
                RecipientEmail = deliveryDto.RecipientEmail,
                RecipientStreet = deliveryDto.RecipientStreet,
                RecipientCity = deliveryDto.RecipientCity,
                RecipientState = deliveryDto.RecipientState,
                RecipientCountry = deliveryDto.RecipientCountry,
                RecipientZipCode = deliveryDto.RecipientZipCode,

                PackageType = deliveryDto.PackageType,
                PackageWeight = deliveryDto.PackageWeight,
                PackageLength = deliveryDto.PackageLength,
                PackageWidth = deliveryDto.PackageWidth,
                PackageHeight = deliveryDto.PackageHeight,

                Status = "created",
                TrackingNumber = Helpers.GenerateTrackingNumber(),
                Notes = deliveryDto.Notes,
                UpdatedAt = DateTime.UtcNow
            };

            // Save delivery to database
            var createdDelivery = await _deliveryService.CreateAsync(delivery);

            // Add tracking history
            await _trackingHistoryService.CreateAsync(new TrackingHistory
            {
                DeliveryId = createdDelivery.Id,
                HolderId = (int)createdDelivery.SenderId,
                Description = "Delivery Created",
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
            var role = userId == "1" ? "employee" : userId == "2" ? "courier" : null;

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
