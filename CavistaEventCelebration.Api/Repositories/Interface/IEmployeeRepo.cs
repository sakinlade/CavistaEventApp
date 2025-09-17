using CavistaEventCelebration.Api.Models;

namespace CavistaEventCelebration.Api.Repositories.Interface
{
    public interface IEmployeeRepo
    {
        bool Add(Employee employee);
        Task<bool> UploadEmployee(List<Employee> employees);
        Task<List<Employee>> Get();
    }
}
