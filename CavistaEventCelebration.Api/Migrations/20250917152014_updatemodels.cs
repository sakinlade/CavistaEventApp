using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CavistaEventCelebration.Api.Migrations
{
    /// <inheritdoc />
    public partial class updatemodels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Employees_AspNetUsers_ApplicationUserId",
                table: "Employees");

            migrationBuilder.DropIndex(
                name: "IX_Employees_ApplicationUserId",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "Employees");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ApplicationUserId",
                table: "Employees",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Employees_ApplicationUserId",
                table: "Employees",
                column: "ApplicationUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Employees_AspNetUsers_ApplicationUserId",
                table: "Employees",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
