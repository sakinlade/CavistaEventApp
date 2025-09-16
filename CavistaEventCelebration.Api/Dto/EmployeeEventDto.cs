using OfficeOpenXml.Drawing;

namespace CavistaEventCelebration.Api.Dto
{
    public class EmployeeEventDto
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Note { get; set; }
        public bool IsRecurring { get; set; }
        public int EmployeeId { get; set; }
    }
}
