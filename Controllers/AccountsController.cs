//using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNetCore.Mvc;
//using PostalManagementAPI.Models;
//using System.Threading.Tasks;
//using PostalManagementAPI.ViewModels;
//using PostalManagementAPI.DTOs;

//namespace PostalManagementAPI.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class AccountController(SignInManager<AppUser> signInManager, UserManager<AppUser> userManager) : ControllerBase
//    {

//        [HttpPost("login")]
//        public async Task<IActionResult> Login([FromBody] LoginRequestDto model)
//        {
//            if (!ModelState.IsValid)
//                return BadRequest(ModelState);

//            var result = await signInManager.PasswordSignInAsync(model.Username, model.Password, model.RememberMe, false);
//            if (!result.Succeeded)
//                return Unauthorized(new { message = "Invalid login attempt." });

//            return Ok(new { message = "Login successful" });
//        }

//        [HttpPost("register")]
//        public async Task<IActionResult> Register([FromBody] RegisterRequestDto model)
//        {
//            if (!ModelState.IsValid)
//                return BadRequest(ModelState);

//            var user = new AppUser { FirstName = model.Name, UserName = model.Email, Email = model.Email };
//            var result = await userManager.CreateAsync(user, model.Password);

//            if (!result.Succeeded)
//                return BadRequest(result.Errors);

//            await signInManager.SignInAsync(user, false);
//            return Ok(new { message = "Registration successful" });
//        }

//        [HttpPost("logout")]
//        public async Task<IActionResult> Logout()
//        {
//            await signInManager.SignOutAsync();
//            return Ok(new { message = "Logged out successfully" });
//        }
//    }
//}
