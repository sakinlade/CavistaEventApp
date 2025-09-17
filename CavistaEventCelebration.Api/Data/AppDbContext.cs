using CavistaEventCelebration.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CavistaEventCelebration.Api.Data
{
    //public class AppDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
    public class AppDbContext : IdentityDbContext<ApplicationUser, IdentityRole<Guid>, Guid>
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
