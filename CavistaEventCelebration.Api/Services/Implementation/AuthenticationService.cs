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
                    var result = await _signInManager.PasswordSignInAsync(userName, model.Password, model.RememberMe, lockoutOnFailure: false);
                    var roles = await _userManager.GetRolesAsync(user);
                    if (result.Succeeded)
                    {
                        var dateExpire = DateTime.Now.AddMinutes(60);
                        var token = GenerateAccessToken(user.UserName, model.Email, roles, dateExpire);

                        return new LoginResponse { Success = true, Message = "Login successful", AccessToken = new JwtSecurityTokenHandler().WriteToken(token) };
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
                var user = new ApplicationUser
                {
                    UserName = model.UserName,
                    Email = model.Email
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

                       if(await _roleManager.RoleExistsAsync("User"))
                        {
                            result = await _userManager.AddToRolesAsync(user, new List<string> { "User" });
                        }                        

                        if (result.Succeeded)
                             return new SignInResponse { Success = true, Message = "User created successfully" };

                        return new SignInResponse { Success = true, Message = "User created successfully but role was not assigned" };
                    }

                    return new SignInResponse { Success = false };

                }

                return new SignInResponse { Success = false };
            }
            catch (Exception)
            {

                return new SignInResponse { Success = false, Message = "internal Server Error" };
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
    }
}
