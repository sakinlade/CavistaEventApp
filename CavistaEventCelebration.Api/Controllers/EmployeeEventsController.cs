using CavistaEventCelebration.Api.Dto;
using CavistaEventCelebration.Api.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace CavistaEventCelebration.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeEventsController : ControllerBase
    {
        private readonly IEventService _eventService;

        public EmployeeEventsController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [HttpPost]
        public async Task<IActionResult> AddEmployeeEvent(EmployeeEventDto employeeEvent)
        {
            return Ok(await _eventService.AddEmployeeEvent(employeeEvent));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateEmployeeEvent(EmployeeEventDto employeeEvent)
        {
            return Ok(await _eventService.UpdateEployeeEvent(employeeEvent));
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteEmployeeevent(Guid id)
        {
            return Ok(await _eventService.DeleteEmployeeEvent(id));
        }

        [HttpGet]
        public async Task<IActionResult> GetEmployeeEvents()
        {
            return Ok(await _eventService.EmployeeEvents());
        }
    }
}
