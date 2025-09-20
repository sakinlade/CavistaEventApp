using CavistaEventCelebration.Api.Models;
using CavistaEventCelebration.Api.Models.Authentication;
using System.Security.Claims;

namespace CavistaEventCelebration.Api.Services.Interface
{
    public interface IAuthenticationService
    {
        Task<ChangePasswordResponse> ChangePasswordAsync(string userId, ChangePassword newPassword);
        Task<ChangeUserRoleResponse> ChangeUserRoleAsync(string userId, ChangeUserRole changeUserRole);
        Task<SignInResponse> CreateAsync(UserSignInModel model);
        string GenerateRefreshToken();
        ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
        Task<List<GetRolesResponse>> GetRolesAsync();
        Task<PaginatedList<UserResponse>> GetUsersAsync(int? index, int? pageSize, string? searchString);
        Task<LoginResponse> LoginAsync(UserLoginModel model);
        Task<LoginResponse> RefreshTokenAsync(RefreshTokenModel refreshTokenModel);
    }
}
