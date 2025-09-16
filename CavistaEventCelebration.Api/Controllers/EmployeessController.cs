using CavistaEventCelebration.Api.Dto;
using CavistaEventCelebration.Api.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace ClientEventsNotifier.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeessController : ControllerBase
    {
        private readonly IEmployeeService _es;
        public EmployeessController(IEmployeeService es)

        {
            _es = es;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return (IActionResult)await _es.Get();
        }


        [HttpPost]
        public async Task<ActionResult<EmployeeDto>> Create([FromBody] EmployeeDto employee)
        {
            _es.AddEmployee(employee);
            return CreatedAtAction(nameof(GetAll), new { id = employee.Id }, employee);
        }

        [HttpPost("upload-excel")]
        public async Task<IActionResult> UploadExcel(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");
            await _es.UploadEmployee(file);
            return Created();
        }
    }
}
