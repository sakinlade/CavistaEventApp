using CavistaEventCelebration.Api.Models;
using CavistaEventCelebration.Api.Models.EmailService;
using CavistaEventCelebration.Api.Services.Interface;
using Microsoft.AspNetCore.Authorization;
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


    [HttpGet]
    public IEnumerable<Event> Get()
    {
        //return Enumerable.Range(1, 5).Select(index =>
        //    new Event
        //    {
        //        Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
        //        Title = $"Event - {Random.Shared.Next(-20, 55)}",
        //    })
        //    .ToArray();

        return null;
    }
     
}

