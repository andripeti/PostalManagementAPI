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

        public DeliveryController(
            DeliveryService deliveryService,
            AddressService addressService,
            PackageHolderService packageHolderService,
            TrackingHistoryService trackingHistoryService,
            OfficeService officeService,
            EmailService emailService
            )
        {
            _deliveryService = deliveryService;
            _addressService = addressService;
            _packageHolderService = packageHolderService;
            _trackingHistoryService = trackingHistoryService;
            _officeService = officeService;
            _emailService = emailService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var deliveries = await _deliveryService.GetAllAsync();
            return Ok(deliveries);
        }

        [HttpGet("{trackingNumber}")]
        public async Task<IActionResult> GetByTrackingNumber(string trackingNumber)
        {
            var delivery = await _deliveryService.GetByTrackingNumberAsync(trackingNumber);
            if (delivery == null) return NotFound();
            return Ok(delivery);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create(DeliveryFormDto delivery)
        {
            var userClaims = User.Claims;
            var userId = userClaims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var userRole = userClaims.FirstOrDefault(c => c.Type == "role")?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User is not authenticated.");
            }

            if (userId != delivery.SenderId.ToString())
            {
                return Unauthorized("You are not authorized to create this delivery.");
            }

            var recipient = "test";
            if (recipient == null)
            {
                string password = Helpers.GenerateRandomString(8);

                await CreateUserInAuth0(delivery.RecipientEmail, password, delivery.RecipientFirstName, delivery.RecipientLastName);

                await _emailService.SendEmailAsync(delivery.RecipientEmail, "Welcome to our service",
                    $"Your temporary password: {password}");
            }

            var recipientAddress = await _addressService.GetByUserIdAsync(delivery.RecipientId);
            if (recipientAddress == null)
            {
                recipientAddress = await _addressService.CreateAsync(new Address
                {
                    City = delivery.RecipientAddressCity,
                    Street = delivery.RecipientAddressStreet,
                    Zip = delivery.RecipientAddressZipCode
                });
            }

            var senderAddress = await _addressService.GetByUserIdAsync(delivery.SenderId);
            var offices = await _officeService.GetAllAsync();
            var distances = new List<(Office office, double distance)>();

            foreach (var office in offices)
            {
                var officeAddress = await _addressService.GetByUserIdAsync(office.AddressId); // Assuming AddressId exists in Office model
                double distance = Helpers.CalculateDistance(senderAddress.Street + " " + senderAddress.City,
                    officeAddress.Street + " " + officeAddress.City);
                distances.Add((office, distance));
            }

            var chosenOffice = distances.OrderBy(d => d.distance).First().office;

            var createdDelivery = await _deliveryService.CreateAsync(new Delivery
            {
                SenderId = delivery.SenderId,
                RecipientId = delivery.RecipientId,
                HolderId = delivery.SenderId,
                AddressId = recipientAddress.Id,
                OfficeId = chosenOffice.Id
            });

            await _trackingHistoryService.CreateAsync(new TrackingHistory
            {
                DeliveryId = createdDelivery.Id,
                HolderId = delivery.SenderId,
                Description = "Dërgesa u krijua",
                Status = "created",
                CreatedAt = DateTime.UtcNow
            });

            return CreatedAtAction(nameof(GetByTrackingNumber), new { trackingNumber = createdDelivery.TrackingNumber }, createdDelivery);
        }
        private async Task CreateUserInAuth0(string email, string password, string firstName, string lastName)
        {
            //var client = new HttpClient();
            //var userData = new
            //{
            //    email = email,
            //    password = password,
            //    connection = "Username-Password-Authentication",
            //    user_metadata = new { firstName, lastName }
            //};

            //var response = await client.PostAsJsonAsync("https://YOUR_AUTH0_DOMAIN/api/v2/users", userData);
            //response.EnsureSuccessStatusCode();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Delivery delivery)
        {
            if (id != delivery.Id) return BadRequest();

            var updatedDelivery = await _deliveryService.UpdateAsync(id, delivery);
            if (updatedDelivery == null) return NotFound();

            return Ok(updatedDelivery);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _deliveryService.DeleteAsync(id);
            return NoContent();
        }

        [Authorize] // Ensure the endpoint is protected
        [HttpPost("{id}/accept")]
        public async Task<IActionResult> Accept(int id)
        {
            var delivery = await _deliveryService.GetByIdAsync(id);
            if (delivery == null) return NotFound();

            // Extract the user’s identity from the JWT token
            var userClaims = User.Claims;
            var userId = userClaims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var userRole = userClaims.FirstOrDefault(c => c.Type == "role")?.Value; // Assuming role is stored in the JWT

            if (string.IsNullOrEmpty(userId) || userRole != "courier")
            {
                return BadRequest("Only couriers can accept deliveries.");
            }

            // Convert userId to int (if applicable)
            if (!int.TryParse(userId, out int courierId))
            {
                return Unauthorized("Invalid user ID.");
            }

            // Change status and create tracking entry
            string statusMessage = "Dërgesa u pranua nga korrieri. Në pritje të marrjes.";
            await _trackingHistoryService.CreateAsync(new TrackingHistory
            {
                DeliveryId = delivery.Id,
                HolderId = courierId,
                Description = statusMessage,
                Status = "accepted",
                CreatedAt = DateTime.UtcNow
            });

            await _deliveryService.UpdateStatusAsync(delivery.Id, "accepted");
            return Ok(delivery);
        }

    }
}
