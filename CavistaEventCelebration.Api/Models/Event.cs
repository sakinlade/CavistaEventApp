namespace CavistaEventCelebration.Api.Models
{
    public class Event
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public bool IsDeprecated { get; set; }
    }
}
