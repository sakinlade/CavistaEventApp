using System.Reflection.Emit;
using CavistaEventCelebration.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CavistaEventCelebration.Api.Data
{
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
            builder.Entity<Event>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                      .ValueGeneratedOnAdd();
                entity.HasData(
                    new Event { Id = 1, Name = "Birthday" },
            new Event { Id = 2, Name = "Work Anniversary" },
            new Event { Id = 3, Name = "Wedding Anniversary" }
                    );
            });
        }

    }
}
