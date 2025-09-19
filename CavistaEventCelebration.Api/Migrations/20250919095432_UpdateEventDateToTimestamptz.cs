using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CavistaEventCelebration.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEventDateToTimestamptz : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Date",
                table: "EmployeeEvents",
                newName: "EventDate");

            migrationBuilder.Sql(
           @"ALTER TABLE ""EmployeeEvents""
              ALTER COLUMN ""EventDate"" TYPE timestamp with time zone 
              USING ""EventDate"" AT TIME ZONE 'UTC';");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "EventDate",
                table: "EmployeeEvents",
                newName: "Date");
            migrationBuilder.Sql(
            @"ALTER TABLE ""EmployeeEvents"" 
              ALTER COLUMN ""EventDate"" TYPE timestamp without time zone;");
        }
    }
}
