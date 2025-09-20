using System.ComponentModel.DataAnnotations;

namespace CavistaEventCelebration.Api.Models.Authentication
{
    public class ChangePassword
    {
        [Required(ErrorMessage = "OldPassword is required")]
        [DataType(DataType.Password)]
        public string OldPassword { get; set; }

        [Required(ErrorMessage = "NewPassword is required")]
        [DataType(DataType.Password)]
        public string NewPassword { get; set; }
    }
}
