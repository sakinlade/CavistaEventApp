using System.ComponentModel.DataAnnotations;

namespace CavistaEventCelebration.Api.Models.Authentication
{
    public class RefreshTokenModel
    {
        [Required(ErrorMessage = "AccessToken is required")]
        public string AccessToken { get; set; }

        [Required(ErrorMessage = "RefreshToken is required")]
        public string RefreshToken { get; set; }
    }
}
