using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PostalManagementAPI.Models;
using PostalManagementAPI.Services;
using System.Security.Claims;

namespace PostalManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AddressController : ControllerBase
    {
        private readonly AddressService _addressService;
        private readonly UserService _userService;

        public AddressController(AddressService addressService, UserService userService)
        {
            _addressService = addressService;
            _userService = userService;
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetByUserId()
        {
            var identityId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userId = await _userService.GetUserIdByIdentityIdAsync(identityId);

            if (identityId == null) return Unauthorized();

            var address = await _addressService.GetByUserIdAsync(userId);
            if (address == null) return NotFound();
            return Ok(address);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create(Address address)
        {
            var createdAddress = await _addressService.CreateAsync(address);
            return CreatedAtAction(nameof(GetByUserId), createdAddress);
        }

        [Authorize]
        [HttpPut]
        public async Task<IActionResult> Update(Address address)
        {
            var identityId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            if (identityId == null) return Unauthorized();

            var updatedAddress = await _addressService.UpdateByIdentityIdAsync(address);
            return Ok(updatedAddress);
        }
    }
}
