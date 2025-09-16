namespace CavistaEventCelebration.Api.Models
{
    public class EmployeeEvents
    {
        public Guid Id { get; set; }
        public Guid EmployeeId { get; set; }
        public Guid EventId { get; set; }
        public Guid Date { get; set; }
        public bool IsDeprecated { get; set; }
    }
}
