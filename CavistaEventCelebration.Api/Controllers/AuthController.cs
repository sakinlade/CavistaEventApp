using CavistaEventCelebration.Api.Models.Authentication;
using CavistaEventCelebration.Api.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace CavistaEventCelebration.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthenticationService _authenticationService;

        public AuthController(IAuthenticationService authentication)
        {
            this._authenticationService = authentication;
        }

        [HttpPost("Signup")]
        public async Task<ActionResult<SignInResponse>> CreateUser(UserSignInModel userSignInModel)
        {
            if (userSignInModel != null)
            {
                var result = await _authenticationService.CreateAsync(userSignInModel);
                if (result != null && result.Success)
                {
                    return Ok(result);
                }

                return BadRequest(result);
            }

            return BadRequest();
        }

        [HttpPost("Login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] UserLoginModel userModel)
        {
            if (userModel != null)
            {
                var result = await _authenticationService.LoginAsync(userModel);

                if (result != null && result.Success)
                {
                    return Ok(result);
                }

                return BadRequest(result);
            }

            return BadRequest();
        }

        [HttpPost("RefreshToken")]
        public async Task<ActionResult<LoginResponse>> RefreshToken([FromBody] RefreshTokenModel refreshTokenModel)
        {
            if (refreshTokenModel != null)
            {
                var result = await _authenticationService.RefreshTokenAsync(refreshTokenModel);

                if (result != null && result.Success)
                {
                    return Ok(result);
                }

                return BadRequest(result);
            }

            return BadRequest();
        }
    }
}
