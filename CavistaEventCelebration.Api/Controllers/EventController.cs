using CavistaEventCelebration.Application.Interfaces;
using CavistaEventCelebration.Domain.EmailService;
using Microsoft.AspNetCore.Mvc;

namespace CavistaEventCelebration.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class EventController : ControllerBase
{
    private readonly IMailService _mailService;

    public EventController(IMailService mailService)
    {
        _mailService = mailService;
    }


    [HttpGet(Name = "GetEvent")]
    public IEnumerable<Event> Get()
    {
        return Enumerable.Range(1, 5).Select(index =>
            new Event
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                Title = $"Event - {Random.Shared.Next(-20, 55)}",
            })
            .ToArray();
    }

    [HttpPost("send-Email")]
    public bool SendMail(MailData Mail_Data)
    {
        return _mailService.SendMail(Mail_Data);
    }
}

public class Event
{
    public DateOnly Date { get; set; }
    public string Title { get; set; }
    public string? Summary { get; set; }
}
