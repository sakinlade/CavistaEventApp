using CavistaEventCelebration.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace CavistaEventCelebration.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class EventController : ControllerBase
{

    [HttpGet(Name = "GetEvent")]
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

