using CavistaEventCelebration.Api.Models.Authentication;

namespace CavistaEventCelebration.Api.Services.Interface
{
    public interface IAuthenticationService
    {
        Task<SignInResponse> CreateAsync(UserSignInModel model);
        Task<LoginResponse> LoginAsync(UserLoginModel model);
    }
}
