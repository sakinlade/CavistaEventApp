namespace CavistaEventCelebration.Api.Models
{
    public class EmployeeEvent
    {
        public Guid Id { get; set; }
        public Guid EmployeeId { get; set; }
        public int EventId { get; set; }
        public DateOnly EventDate { get; set; }
        public bool IsDeprecated { get; set; } = false;
    }
}
