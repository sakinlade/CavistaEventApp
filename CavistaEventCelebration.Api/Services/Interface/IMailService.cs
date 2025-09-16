
using CavistaEventCelebration.Api.Models.EmailService;

namespace CavistaEventCelebration.Api.Services.Interface
{
    public interface IMailService
    {
        bool SendMail(MailData Mail_Data);
    }
}
