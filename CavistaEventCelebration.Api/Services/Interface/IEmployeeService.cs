
using CavistaEventCelebration.Api.Dto;
using CavistaEventCelebration.Api.Models;
using CavistaEventCelebration.Api.Models.EmailService;

namespace CavistaEventCelebration.Api.Services.Interface
{
    public interface IEmployeeService
    {
        bool AddEmployee(EmployeeDto employee);
        Task<bool> UploadEmployee(IFormFile file);
        Task<List<Employee>> Get();
    }
}
