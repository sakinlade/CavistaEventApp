using Microsoft.EntityFrameworkCore;
using CavistaEventCelebration.Api.Models;

namespace CavistaEventCelebration.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Event> Events { get; set; }
        public DbSet<Employee>  Employees { get; set; }
        public DbSet<EmployeeEvents> EmployeeEvents { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<Employee>().HasIndex(e => e.EmailAddress).IsUnique(true);
        }

    }
}
