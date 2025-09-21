using CavistaEventCelebration.Api.Models.EmailService;
using CavistaEventCelebration.Api.Services.Interface;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;

namespace CavistaEventCelebration.Api.Services.implementation
{
    public class MailService : IMailService
    {
        private readonly MailSettings _mailSettings;
        public MailService(IOptions<MailSettings> options)
        {
            _mailSettings = options.Value;
        }

        public async Task SendEmailAsync(MailData mailData)
        {
            try
            {
                var host = Environment.GetEnvironmentVariable("SMTP_HOST") ?? _mailSettings.Host;
                var username = Environment.GetEnvironmentVariable("SMTP_USERNAME") ?? _mailSettings.UserName;
                var password = Environment.GetEnvironmentVariable("SMTP_PASSWORD") ?? _mailSettings.Password;
                var fromEmail = Environment.GetEnvironmentVariable("SMTP_EMAIL") ?? _mailSettings.EmailId;
                var emailMessage = new MimeMessage();
                var emailFrom = new MailboxAddress(_mailSettings.Name, fromEmail);
                emailMessage.From.Add(emailFrom);
                var emailTo = new MailboxAddress(mailData.EmailToName, mailData.EmailToId);
                emailMessage.To.Add(emailTo);
                emailMessage.Subject = mailData.EmailSubject;
                var bodyBuilder = new BodyBuilder();
                bodyBuilder.TextBody = mailData.EmailBody;
                if (!string.IsNullOrWhiteSpace(mailData.EmailBody) &&
                    (mailData.EmailBody.Contains("<html", StringComparison.OrdinalIgnoreCase) ||
                     mailData.EmailBody.Contains("<body", StringComparison.OrdinalIgnoreCase) ||
                     mailData.EmailBody.Contains("</")))
                {
                    bodyBuilder.HtmlBody = mailData.EmailBody;
                }
                emailMessage.Body = bodyBuilder.ToMessageBody();
                using var smtp = new SmtpClient();
                smtp.Connect(host, _mailSettings.Port, _mailSettings.UseSSL);
                smtp.Authenticate(username, password);
                await smtp.SendAsync(emailMessage);
                await smtp.DisconnectAsync(true);


            }
            catch (Exception ex)
            {
                Console.WriteLine($"Email sending failed: {ex.Message}");

            }
        }
    }
}
