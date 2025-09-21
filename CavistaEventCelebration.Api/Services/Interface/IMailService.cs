
using CavistaEventCelebration.Api.Models.EmailService;

namespace CavistaEventCelebration.Api.Services.Interface
{
    public interface IMailService
    {
        Task SendEmailAsync(MailData mailData);
    }
}
