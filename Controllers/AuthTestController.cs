using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PostalManagementAPI.Services;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class AuthTestController : ControllerBase
{
    private readonly UserService _userService;

    public AuthTestController(UserService userService)
    {
        _userService = userService;
    }

    [Authorize]
    [HttpGet("user-info")]
    public IActionResult GetUserInfo()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        var userRoles = User.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();

        return Ok(new
        {
            message = "Token is valid!",
            userId,
            userEmail,
            roles = userRoles
        });
    }

    [Authorize]
    [HttpPost("profile")]
    public async Task<IActionResult> SaveProfile()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var newUser = await _userService.CreateUserAsync(userId);

        return Ok(new
        {
            message = "User saved successfully",
            newUser?.Id,
        });
}
}
