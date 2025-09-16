using Microsoft.EntityFrameworkCore;
using CavistaEventCelebration.Api.Models;

namespace CavistaEventCelebration.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Event> Events { get; set; }
    }
}
