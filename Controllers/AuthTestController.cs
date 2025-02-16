using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/auth-test")]
public class AuthTestController : ControllerBase
{
    [Authorize]
    [HttpGet("user-info")]
    public IActionResult GetUserInfo()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
        var userRoles = User.FindAll(ClaimTypes.Role).Select(r => r.Value).ToList();

        var userEmail2 = User.FindFirst("email")?.Value;  // If 'email' is a custom claim
        var userRoles2 = User.FindAll("roles").Select(r => r.Value).ToList();

        return Ok(new
        {
            message = "Token is valid!",
            userId,
            userEmail,
            roles = userRoles
        });
    }
}
