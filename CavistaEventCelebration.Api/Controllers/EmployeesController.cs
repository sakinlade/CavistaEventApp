using CavistaEventCelebration.Api.Dto;
using CavistaEventCelebration.Api.Services.Interface;
using Hangfire;
using Microsoft.AspNetCore.Mvc;

namespace CavistaEventCelebration.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _es;
        public EmployeesController(IEmployeeService es)

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
        public IActionResult ImportEmployees(IFormFile file, [FromServices] IBackgroundJobClient backgroundJobs)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");
            var filePath = Path.Combine(Path.GetTempPath(), file.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }
            backgroundJobs.Enqueue<IEmployeeService>(service => service.UploadEmployee(filePath));

            return Ok(new { Message = "Employee import job has been queued." });
        }

    }
}
