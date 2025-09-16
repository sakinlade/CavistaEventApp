using CavistaEventCelebration.Api.Data;
using CavistaEventCelebration.Api.Models;
using CavistaEventCelebration.Api.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace CavistaEventCelebration.Api.Repositories.Implementation
{

    public class EmployeeRepo : IEmployeeRepo
    {
        private readonly AppDbContext _db;
        public EmployeeRepo(AppDbContext db)
        {
            _db = db;
        }

        public bool Add(Employee employee)
        {
            _db.Employees.Add(employee);
            _db.SaveChanges();
            return true;
        }

        public async Task<bool> UploadEmployee(List<Employee> employees)
        {
            await _db.Employees.AddRangeAsync(employees);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<List<Employee>> Get()
        {
            return await _db.Employees.Where(e => !e.IsDeprecated).ToListAsync();
        }
    }
}
