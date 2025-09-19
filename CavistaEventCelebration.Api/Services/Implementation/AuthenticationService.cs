using CavistaEventCelebration.Api.Data;
using CavistaEventCelebration.Api.Models;
using CavistaEventCelebration.Api.Models.Authentication;
using CavistaEventCelebration.Api.Services.Interface;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace CavistaEventCelebration.Api.Services.Implementation
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole<Guid>> _roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly AppDbContext _dbContext;

        public AuthenticationService(IConfiguration configuration, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole<Guid>> roleManager, SignInManager<ApplicationUser> signInManager, AppDbContext dbContext)
        {
            _configuration = configuration;
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _dbContext = dbContext;
        }

        public async Task<LoginResponse> LoginAsync(UserLoginModel model)
        {
            try
            {
                var userName = model.Email;
                var user = await _userManager.FindByEmailAsync(model.Email);

                if (user != null)
                {
                    userName = user.UserName;
                }

                if (user != null && !string.IsNullOrWhiteSpace(userName))
                {                   
                    var refreshToken = GenerateRefreshToken();
                    user.RefreshToken = refreshToken;
                    user.RefreshTokenExpiryTime = DateTime.Now.AddDays(7).ToUniversalTime();
                    var result = await _signInManager.PasswordSignInAsync(userName, model.Password, model.RememberMe, lockoutOnFailure: false);
                    var roles = await _userManager.GetRolesAsync(user);
                    if (result.Succeeded && await _dbContext.SaveChangesAsync() > 0)
                    {
                        var dateExpire = DateTime.Now.AddMinutes(10);
                        var token = GenerateAccessToken(userName, model.Email, roles, dateExpire);

                        return new LoginResponse { Success = true, Message = "Login successful", AccessToken = new JwtSecurityTokenHandler().WriteToken(token), Expiry = dateExpire, RefreshToken = refreshToken };
                    }
                }

                return new LoginResponse { Success = false };
            }
            catch (Exception)
            {
                return new LoginResponse { Success = false, Message = "Internal server error" };
            }                      
        }

        public async Task<SignInResponse> CreateAsync(UserSignInModel model)
        {
            try
            {
                var existingUser = await _userManager.FindByEmailAsync(model.Email);

                if (existingUser != null)
                {
                    return new SignInResponse { Success = false, Message = "Unsuccessful", Errors = new List<string> { "Email already exists" } };
                }

                var user = new ApplicationUser
                {
                    UserName = model.UserName,
                    Email = model.Email,
                    CreatedOn = DateTime.Now.ToUniversalTime(),
                    ModifiedOn = DateTime.Now.ToUniversalTime(),                    
                };                

                if (user != null)
                {
                    var result = await _userManager.CreateAsync(user, model.Password);

                    if (result.Succeeded)
                    {
                        var employee = new Employee
                        {
                            FirstName = model.FirstName,
                            LastName = model.LastName,
                            EmailAddress = model.Email
                        };

                        _dbContext.Employees.Add(employee);

                        if (await _roleManager.RoleExistsAsync("User"))
                        {
                            result = await _userManager.AddToRolesAsync(user, new List<string> { "User" });
                        }

                        if (result.Succeeded)
                             return new SignInResponse { Success = true, Message = "User created successfully" };

                        return new SignInResponse { Success = true, Message = "User created successfully but role or employee was not assigned to the user" };
                    }

                    return new SignInResponse { Success = false, Message = "Unsuccessful", Errors = result.Errors.Select(x => x.Description).ToList()  };
                }

                return new SignInResponse { Success = false, Message = "Unsuccessful" };
            }
            catch (Exception ex)
            {
                return new SignInResponse { Success = false, Message = $"internal Server Error {ex.Message}" };
            }         
        }

        private JwtSecurityToken GenerateAccessToken(string userName, string email, IList<string> roles, DateTime? expiry)
        {         
            // Create user claims
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, userName),
                new Claim(ClaimTypes.Email, email),
             };

            claims.AddRange(roles.Select(x =>  new Claim(ClaimTypes.Role, x)).ToList());

            // Create a JWT
            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: expiry, // Token expiration time
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"])),
                SecurityAlgorithms.HmacSha256)
            );

            return token;
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false, //you might want to validate the audience and issuer depending on your use case
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("superSecretKey@345")),
                ValidateLifetime = false //here we are saying that we don't care about the token's expiration date
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken;
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");
            return principal;
        }
    }
}
