using CavistaEventCelebration.Api.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace CavistaEventCelebration.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly IEventService _eventService;

        public EventsController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [HttpGet]
        public async Task<IActionResult> GetEvents()
        {
            return Ok(await _eventService.Events());
        }

        [HttpPost]
        public async Task<IActionResult> AddEvent([FromBody] string name)
        {
            return Ok(await _eventService.AddEvent(name));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEvent(int id, [FromBody] string name)
        {
            return Ok(await _eventService.UpdateEvent(id, name));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            return Ok(await _eventService.DeleteEvent(id));
        }
    }
}
