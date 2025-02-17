    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Authorization;

namespace PostalManagementAPI.Controllers
{
    [Authorize]
    public class HomeController : ControllerBase
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }
    }
}