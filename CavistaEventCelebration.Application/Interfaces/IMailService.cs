using CavistaEventCelebration.Domain.EmailService;
using Org.BouncyCastle.Asn1.Pkcs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CavistaEventCelebration.Application.Interfaces
{
    public interface IMailService
    {
        bool SendMail(MailData Mail_Data);
    }
}
