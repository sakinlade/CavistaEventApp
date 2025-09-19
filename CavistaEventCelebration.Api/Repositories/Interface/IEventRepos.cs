using CavistaEventCelebration.Api.Dto;
using CavistaEventCelebration.Api.Models;

namespace CavistaEventCelebration.Api.Repositories.Interface
{
    public interface IEventRepo
    {
        Task<List<DailyEventDto>> GetDailyEvents(int eventId);
        Task<List<Event>> Events();
    }
}
