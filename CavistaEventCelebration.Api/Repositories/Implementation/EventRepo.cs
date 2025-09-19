using CavistaEventCelebration.Api.Data;
using CavistaEventCelebration.Api.Dto;
using CavistaEventCelebration.Api.Models;
using CavistaEventCelebration.Api.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace CavistaEventCelebration.Api.Repositories.Implementation
{

    public class EventRepo : IEventRepo    {
        private readonly AppDbContext _db;
        public EventRepo(AppDbContext db)
        {
            _db = db;
        }


        public async Task<List<DailyEventDto>> GetDailyEvents(int eventId)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            return await (
                from ee in _db.EmployeeEvents
                join emp in _db.Employees on ee.EmployeeId equals emp.Id
                join e in _db.Events on ee.EventId equals e.Id
                where ee.EventId == eventId
                      && ee.EventDate == today  
                      && !ee.IsDeprecated
                      && !emp.IsDeprecated
                select new DailyEventDto
                {
                    EmployeeEmailAddress = emp.EmailAddress,
                    EmployeeFirstName = emp.FirstName,
                    EmployeeLastName = emp.LastName,
                    EventId = ee.EventId,
                    EventTitle = e.Name
                }
            ).ToListAsync();
        }

        public async Task<List<Event>> Events()
        {
            return await _db.Events.Where(e => !e.IsDeprecated).ToListAsync();
        }
    }
}
