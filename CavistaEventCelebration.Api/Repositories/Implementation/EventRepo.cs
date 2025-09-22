using CavistaEventCelebration.Api.Data;
using CavistaEventCelebration.Api.Dto;
using CavistaEventCelebration.Api.Models;
using CavistaEventCelebration.Api.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace CavistaEventCelebration.Api.Repositories.Implementation
{

    public class EventRepo : IEventRepo
    {
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


        public async Task<bool> AddEvent(Event eventItem)
        {
            try
            {
                _db.Add(eventItem);
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                return false;
            }

        }

        public async Task<bool> Remove(Event eventItem)
        {
            try
            {
                eventItem.IsDeprecated = true;
                var result = _db.Events.Update(eventItem);
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                return false;
            }
        }

        public async Task<Event> GetById(int Id)
        {
            try
            {
                return await _db.Events.FirstOrDefaultAsync(e => e.Id == Id && !e.IsDeprecated);
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                return new Event();
            }
        }

        public async Task<bool> UpdateEvent(Event eventItem)
        {
            try
            {
                _db.Events.Update(eventItem);
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                return false;
            }
        }

        public async Task<bool> DoesEventExist(string name)
        {
            try
            {
                var normalizedName = name.Trim();
                var eventItem = await _db.Events.FirstOrDefaultAsync(e => e.Name.Trim().Equals(normalizedName, StringComparison.CurrentCultureIgnoreCase) && !e.IsDeprecated);
                if (eventItem == null)
                {
                    return false;
                }
                return true;
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                return false;
            }
        }

        public async Task<bool> AddEmployeeEvent(EmployeeEvent eventItem)
        {
            try
            {
                _db.EmployeeEvents.Add(eventItem);
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                return false;
            }
        }

        public async Task<bool> UpdateEmployeeEvent(EmployeeEvent eventItem)
        {
            try
            {
                _db.EmployeeEvents.Update(eventItem);
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                return false;
            }
        }

        public async Task<List<EmployeeEvent>> EmployeeEventGet()
        {
            try
            {
                return await _db.EmployeeEvents.Where(e => !e.IsDeprecated).ToListAsync();

            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                return new List<EmployeeEvent>();
            }
        }

        public async Task<EmployeeEvent> GetEmployeeEventById(Guid id)
        {
            try
            {
                return await _db.EmployeeEvents.Where(e => e.Id == id && !e.IsDeprecated).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                return null;
            }
        }

        public async Task<bool> DoesEmployeeEventExist(Guid employeeId, int eventId)
        {
            try
            {
                var empEvent = await _db.EmployeeEvents.FirstOrDefaultAsync(emp => emp.EmployeeId == employeeId && emp.EventId == eventId && !emp.IsDeprecated);
                if (empEvent == null)
                {
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                return false;
            }
        }
    }
}
