using CavistaEventCelebration.Api.Models.EmailService;
using CavistaEventCelebration.Api.Services.Interface;
using MailKit.Net.Smtp;
using MailKit.Security;
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

        public bool SendMail(MailData Mail_Data)
        {
            try
            {
                //MimeMessage - a class from Mimekit
                MimeMessage email_Message = new MimeMessage();
                MailboxAddress email_From = new MailboxAddress(_mailSettings.Name, _mailSettings.EmailId);
                email_Message.From.Add(email_From);
                MailboxAddress email_To = new MailboxAddress(Mail_Data.EmailToName, Mail_Data.EmailToId);
                email_Message.To.Add(email_To);
                email_Message.Subject = Mail_Data.EmailSubject;
                BodyBuilder emailBodyBuilder = new BodyBuilder();
                emailBodyBuilder.TextBody = Mail_Data.EmailBody;
                email_Message.Body = emailBodyBuilder.ToMessageBody();
                //this is the SmtpClient class from the Mailkit.Net.Smtp namespace, not the System.Net.Mail one
                SmtpClient MailClient = new SmtpClient();
                MailClient.Connect(_mailSettings.Host, _mailSettings.Port, _mailSettings.UseSSL);
                MailClient.Authenticate(_mailSettings.EmailId, _mailSettings.Password);
                MailClient.Send(email_Message);
                MailClient.Disconnect(true);
                MailClient.Dispose();
                return true;
            }
            catch (Exception ex)
            {
                // Exception Details
                return false;
            }
        }

        public async Task SendEmailAsync(MailData mailData)
        {
            try
            {
                using (var client = new SmtpClient())
                {
                    client.Connect(_mailSettings.Host, _mailSettings.Port, _mailSettings.UseSSL);
                    client.Authenticate(_mailSettings.EmailId, _mailSettings.Password);

                    var email = new MimeMessage();
                    email.From.Add(new MailboxAddress(_mailSettings.Name, _mailSettings.EmailId));
                    email.To.Add(new MailboxAddress(mailData.EmailToName, mailData.EmailToId));
                    email.Subject = mailData.EmailSubject;
                    BodyBuilder emailBodyBuilder = new BodyBuilder();
                    emailBodyBuilder.TextBody = mailData.EmailBody;
                    email.Body = emailBodyBuilder.ToMessageBody();
                    await client.SendAsync(email);
                    await client.DisconnectAsync(true);
                }
            }
            catch (Exception ex)
            {

                throw;
            }
           
        }


    }
}
