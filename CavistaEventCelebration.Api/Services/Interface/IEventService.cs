using CavistaEventCelebration.Api.Dto;
using CavistaEventCelebration.Api.Models;

namespace CavistaEventCelebration.Api.Services.Interface
{
    public interface IEventService
    {
        Task<Response<bool>> AddEvent(string name);
        Task<Response<bool>> DeleteEvent(int id);
        Task<Response<List<Event>>> Events();
        Task<Response<bool>> UpdateEvent(int id, string name);
        Task<Response<bool>> AddEmployeeEvent(EmployeeEventDto employeeEvent);
        Task<Response<bool>> DeleteEmployeeEvent(Guid id);
        Task<Response<List<EmployeeEvent>>> EmployeeEvents();
        Task<Response<bool>> UpdateEployeeEvent(EmployeeEventDto employeeEvent);
    }
}
