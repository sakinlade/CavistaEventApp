using CavistaEventCelebration.Api.Dto;
using CavistaEventCelebration.Api.Models;
using CavistaEventCelebration.Api.Repositories.Interface;
using CavistaEventCelebration.Api.Services.Interface;
using static Microsoft.IO.RecyclableMemoryStreamManager;

namespace CavistaEventCelebration.Api.Services.Implementation
{
    public class EventService : IEventService
    {
        private readonly IEventRepo _eventRepo;
        public EventService(IEventRepo eventRepo)
        {
            _eventRepo = eventRepo;
        }

        public async Task<Response<bool>> AddEvent(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return Response<bool>.Failure("Name can not empty");
            }

            if ( await _eventRepo.DoesEventExist(name))
            {
                return Response<bool>.Failure($"Event with {name} already exist");
            }
            
            var eventItem = new Event
            {
                Name = name,
                IsDeprecated = false
            };

            var result = await _eventRepo.AddEvent(eventItem);

            if (result)
            {
                return Response<bool>.Success(result, "Event created");
            }

            return Response<bool>.Failure("Could not create event");
        }


        public async Task<Response<bool>> DeleteEvent(int id)
        {
            var eventItem = await _eventRepo.GetById(id);
            if (eventItem == null)
            {
                return Response<bool>.Failure("Event does not exist");
            }
            var result = await _eventRepo.Remove(eventItem);

            if (result)
            {
                return Response<bool>.Success(result, "Event Deleted");
            }

            return Response<bool>.Failure("Could not delete event, try again later");
        }

        public async Task<Response<List<Event>>> Events()
        {
            var events = await _eventRepo.Events();
            return Response<List<Event>>.Success(events);
        }

        public async Task<Response<bool>> UpdateEvent(int id, string name)
        {
            var eventItem = await _eventRepo.GetById(id);
            if (eventItem == null)
            {
                return Response<bool>.Failure("Event does not exist");
            }
            eventItem.Name = name;
            var result = await _eventRepo.UpdateEvent(eventItem);
            if (result)
            {
               return  Response<bool>.Success(true, "Event update");
            }
            return Response<bool>.Failure("Event could not be update, please try again");
        }

        public async Task<Response<bool>> AddEmployeeEvent(EmployeeEventDto employeeEvent)
        {
            if(employeeEvent == null)
            {
                return Response<bool>.Failure("Invalid request");
            }

            if( await _eventRepo.DoesEmployeeEventExist(employeeEvent.EmployeeId, employeeEvent.EventId))
            {
                return Response<bool>.Failure("Employee event already exist");
            }

            var newEployeeEvent = new EmployeeEvent()
            {
                Id = new Guid(),
                EmployeeId = employeeEvent.EmployeeId,
                EventId = employeeEvent.EventId,
                EventDate = employeeEvent.EventDate,
                IsDeprecated = false
            };

            var result = await _eventRepo.AddEmployeeEvent(newEployeeEvent);
            if (result)
            {
                return Response<bool>.Success(true, " Employee Event Added");
            }
            return Response<bool>.Failure("Event could not be Added, please try again");
        }

        public async Task<Response<bool>> DeleteEmployeeEvent(Guid id)
        {
            var eventItem = await _eventRepo.GetEmployeeEventById(id);
            if (eventItem == null)
            {
                return Response<bool>.Failure("Employee Event does not exist");
            }
            eventItem.IsDeprecated = true;
            var result = await _eventRepo.UpdateEmployeeEvent(eventItem);

            if (result)
            {
                return Response<bool>.Success(result, "Event Deleted");
            }
            return Response<bool>.Failure("Could not delete employee event, try again later");
        }

        public async Task<Response<List<EmployeeEvent>>> EmployeeEvents()
        {
            var events = await _eventRepo.EmployeeEventGet();
            return Response<List<EmployeeEvent>>.Success(events);
        }

        public async Task<Response<bool>> UpdateEployeeEvent(EmployeeEventDto employeeEvent)
        {
            var eventItem = await _eventRepo.GetEmployeeEventById(employeeEvent.Id);
            if (eventItem == null)
            {
                return Response<bool>.Failure("Employee Event does not exist");
            }
            eventItem.EmployeeId = employeeEvent.EmployeeId;
            eventItem.EventId = employeeEvent.EventId;
            eventItem.EventDate = employeeEvent.EventDate;

            var result = await _eventRepo.UpdateEmployeeEvent(eventItem);
            if (result)
            {
                return Response<bool>.Success(true, "Employee Event updated");
            }
            return Response<bool>.Failure("Employee Event could not be updated, please try again");
        }
    }
}
