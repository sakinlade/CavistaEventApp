using System.ComponentModel.DataAnnotations;

namespace CavistaEventCelebration.Api.Models.Authentication
{
    public class ChangeUserRole
    {
        [Required(ErrorMessage = "Role is required")]
        public string Role { get; set; }
    }
}
