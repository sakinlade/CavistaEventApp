using Microsoft.AspNetCore.Identity;

namespace CavistaEventCelebration.Api.Models
{
    public class ApplicationUser : IdentityUser<Guid>, IAuditable
    {
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }

        public DateTime CreatedOn { get; set; }

        public DateTime ModifiedOn { get; set; }

    }
}
