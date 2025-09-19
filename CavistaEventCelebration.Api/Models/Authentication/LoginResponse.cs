namespace CavistaEventCelebration.Api.Models.Authentication
{
    public class LoginResponse : BaseResponse
    {
        public string AccessToken { get; set; }

        public DateTime Expiry { get; set; }

        public string RefreshToken { get; set; }
    }
}
