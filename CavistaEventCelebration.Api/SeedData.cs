using CavistaEventCelebration.Api.Data;
using CavistaEventCelebration.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace CavistaEventCelebration.Api
{
    public class SeedData
    {
        public async static Task Initialize(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetService<AppDbContext>();

            if (context != null)
            {

                string[] roles = new string[] { "User", "People", "SuperAdmin" };

                foreach (string role in roles)
                {
                    var roleStore = new RoleStore<IdentityRole<Guid>, AppDbContext, Guid>(context);

                    if (!context.Roles.Any(r => r.Name == role))
                    {
                        await roleStore.CreateAsync(new IdentityRole<Guid>()
                        {
                            Name = role,
                            NormalizedName = role.ToUpper()
                        });
                    }
                }


                var user = new ApplicationUser
                {
                    
                    Email = "superAdmin@Sparkhub.com",
                    NormalizedEmail = "SUPERADMIN@SPARKHUB.COM",
                    UserName = "Sparkhub",
                    NormalizedUserName = "SPARKHUB",
                    PhoneNumber = "+111111111111",
                    EmailConfirmed = true,
                    PhoneNumberConfirmed = true,
                    SecurityStamp = Guid.NewGuid().ToString("D")
                };

                await context.Employees.AddAsync(new Employee
                {
                    FirstName = "Spark",
                    LastName = "Hub",
                    EmailAddress = user.Email,
                });


                if (!context.Users.Any(u => u.UserName == user.UserName))
                {
                    var password = new PasswordHasher<ApplicationUser>();
                    var hashed = password.HashPassword(user, "SparkHubSecret");
                    user.PasswordHash = hashed;

                    var userStore = new UserStore<ApplicationUser, IdentityRole<Guid>, AppDbContext, Guid>(context);
                    var result = userStore.CreateAsync(user);

                }

                await AssignRoles(serviceProvider, user.Email, roles);

                await context.SaveChangesAsync();
            }
        }

        public static async Task<IdentityResult> AssignRoles(IServiceProvider services, string email, string[] roles)
        {
            UserManager<ApplicationUser>? _userManager = services.GetService<UserManager<ApplicationUser>>();
            ApplicationUser? user = _userManager != null ? await _userManager.FindByEmailAsync(email) : null;
            IdentityResult result = new IdentityResult();

            if(user != null && _userManager != null)
            {
                result = await _userManager.AddToRolesAsync(user, roles);
            }                

            return result;
        }

    }
}
