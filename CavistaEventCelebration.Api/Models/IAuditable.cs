namespace CavistaEventCelebration.Api.Models
{
    public interface IAuditable
    {
        DateTime CreatedOn { get; set; }

        DateTime ModifiedOn { get; set; }
    }
}
