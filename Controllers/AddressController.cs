using Microsoft.AspNetCore.Mvc;
using PostalManagementAPI.Models;
using PostalManagementAPI.Services;

namespace PostalManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AddressController : ControllerBase
    {
        private readonly AddressService _addressService;

        public AddressController(AddressService addressService)
        {
            _addressService = addressService;
        }

        [HttpGet("{identityId}")]
        public async Task<IActionResult> GetByIdentityId(int identityId)
        {
            var address = await _addressService.GetByUserIdAsync(identityId);
            if (address == null) return NotFound();
            return Ok(address);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Address address)
        {
            var createdAddress = await _addressService.CreateAsync(address);
            return CreatedAtAction(nameof(GetByIdentityId), createdAddress);
        }

        [HttpPut("{identityId}")]
        public async Task<IActionResult> Update(Address address)
        {
            var updatedAddress = await _addressService.UpdateByIdentityIdAsync(address);
            return Ok(updatedAddress);
        }
    }
}
