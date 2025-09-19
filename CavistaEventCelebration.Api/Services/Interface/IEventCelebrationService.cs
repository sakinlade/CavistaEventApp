namespace CavistaEventCelebration.Api.Services.Interface
{
    public interface IEventCelebrationService
    {
        Task NotifyEventAsync(int eventId);
        Task RegisterRecurringJobsAsync();
    }
}
