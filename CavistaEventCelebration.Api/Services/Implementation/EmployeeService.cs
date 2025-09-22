using CavistaEventCelebration.Api.Dto;
using CavistaEventCelebration.Api.Models;
using CavistaEventCelebration.Api.Repositories.Interface;
using CavistaEventCelebration.Api.Services.Interface;
using ClosedXML.Excel;

namespace CavistaEventCelebration.Api.Services.Implementation
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepo _repo;
        public EmployeeService(IEmployeeRepo repo)
        {
            _repo = repo;
        }

        public bool AddEmployee(EmployeeDto employee)
        {
            if (employee == null) throw new ArgumentNullException("Employee can not be null");

            var _employee = new Employee()
            {
                Id = new Guid(),
                EmailAddress = employee.Email,
                FirstName = employee.FirstName,
                LastName = employee.LastName
            };
            return _repo.Add(_employee);
        }

        public async Task UploadEmployee(string filePath)
        {
            try
            {
                using var workbook = new XLWorkbook(filePath);
                var worksheet = workbook.Worksheet(1);
                var rows = worksheet.RowsUsed();
                var employees = new List<Employee>();
                foreach (var row in rows.Skip(1)) 
                {
                    var firstName = row.Cell(1).GetString();
                    var lastName = row.Cell(2).GetString();
                    var email = row.Cell(3).GetString();
                    if (string.IsNullOrWhiteSpace(email)) continue;
                    employees.Add(new Employee
                    {
                        Id = Guid.NewGuid(),
                        FirstName = firstName,
                        LastName = lastName,
                        EmailAddress = email,
                        IsDeprecated = false
                    });
                }

                await _repo.UploadEmployee(employees);
                Console.WriteLine($" Imported {employees.Count} employees successfully from {filePath}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($" Employee import failed: {ex.Message}");
            }
            finally
            {
                if (File.Exists(filePath))
                    File.Delete(filePath);
            }
        }

        public async Task<List<Employee>> Get()
        {
            return await _repo.Get();
        }

    }
}
