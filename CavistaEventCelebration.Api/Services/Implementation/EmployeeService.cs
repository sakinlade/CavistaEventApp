using CavistaEventCelebration.Api.Data;
using CavistaEventCelebration.Api.Dto;
using CavistaEventCelebration.Api.Models;
using CavistaEventCelebration.Api.Repositories.Interface;
using CavistaEventCelebration.Api.Services.Interface;
using OfficeOpenXml.Drawing;
using OfficeOpenXml;

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

        public async Task<bool> UploadEmployee(IFormFile file)
        {
            var employees = new List<Employee>();
            using var stream = new System.IO.MemoryStream();
            await file.CopyToAsync(stream);
            using var package = new ExcelPackage(stream);
            var sheet = package.Workbook.Worksheets.FirstOrDefault();
            if (sheet == null) return false;
            var row = 2; var created = 0; 
            while (true)
            {
                var first = sheet.Cells[row, 1].Text;
                if (string.IsNullOrWhiteSpace(first))
                    break; var last = sheet.Cells[row, 2].Text;
                var email = sheet.Cells[row, 3].Text;
                var phone = sheet.Cells[row, 4].Text;
                var btxt = sheet.Cells[row, 5].Text;
                var atxt = sheet.Cells[row, 6].Text;
                var cname = sheet.Cells[row, 7].Text;
                var cdate = sheet.Cells[row, 8].Text;
                var employee = new Employee()
                {
                    Id = new Guid(),
                    FirstName = first,
                    LastName = last,
                    EmailAddress = email,
                };
                employees.Add(employee); row++; created++;
            }
            
            await _repo.UploadEmployee(employees);
            return true;
        }

        public async Task<List<Employee>> Get()
        {
            return await _repo.Get();
        }

    }
}
