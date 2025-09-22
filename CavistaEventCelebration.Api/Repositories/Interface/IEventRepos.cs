using CavistaEventCelebration.Api.Dto;
using CavistaEventCelebration.Api.Models;

namespace CavistaEventCelebration.Api.Repositories.Interface
{
    public interface IEventRepo
    {
        Task<List<DailyEventDto>> GetDailyEvents(int eventId);
        Task<List<Event>> Events();
        Task<bool> AddEvent(Event eventItem);
        Task<bool> Remove(Event eventItem);
        Task<Event> GetById(int Id);
        Task<bool> UpdateEvent(Event eventItem);
        Task<bool> DoesEventExist(string Name);
        Task<bool> AddEmployeeEvent(EmployeeEvent eventItem);
        Task<bool> UpdateEmployeeEvent(EmployeeEvent eventItem);
        Task<List<EmployeeEvent>> EmployeeEventGet();
        Task<EmployeeEvent> GetEmployeeEventById(Guid id);
        Task<bool> DoesEmployeeEventExist(Guid employeeId, int eventId);
    }
}
