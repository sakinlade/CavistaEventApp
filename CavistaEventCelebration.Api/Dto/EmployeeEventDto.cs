namespace CavistaEventCelebration.Api.Dto
{
    public class EmployeeEventDto
    {
        public Guid Id { get; set; }
        public Guid EmployeeId { get; set; }
        public int EventId { get; set; }
        public DateOnly EventDate { get; set; }
    }
}
