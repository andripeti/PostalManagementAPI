using Microsoft.AspNetCore.Mvc;
using PostalManagementAPI.Models;
using PostalManagementAPI.Services;

namespace PostalManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OfficeController : ControllerBase
    {
        private readonly OfficeService _officeService;

        public OfficeController(OfficeService officeService)
        {
            _officeService = officeService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Office>> GetById(int id)
        {
            var office = await _officeService.GetByIdAsync(id);

            if (office == null)
            {
                return NotFound();
            }

            return Ok(office);
        }

        [HttpPost]
        public async Task<ActionResult<Office>> Create(Office office)
        {
            var createdOffice = await _officeService.CreateAsync(office);
            return CreatedAtAction(nameof(GetById), new { id = createdOffice.Id }, createdOffice);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, Office office)
        {
            var updatedOffice = await _officeService.UpdateAsync(id, office);
            if (updatedOffice == null)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var success = await _officeService.DeleteAsync(id);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
