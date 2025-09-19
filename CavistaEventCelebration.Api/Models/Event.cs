namespace CavistaEventCelebration.Api.Models
{
    public class Event
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsDeprecated { get; set; } = false;
    }
}
