using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PostalManagementAPI.Migrations
{
    /// <inheritdoc />
    public partial class RenameEmployees : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_employees_AspNetUsers_IdentityId",
                table: "employees");

            migrationBuilder.DropPrimaryKey(
                name: "PK_employees",
                table: "employees");

            migrationBuilder.RenameTable(
                name: "employees",
                newName: "tbl_employees");

            migrationBuilder.RenameIndex(
                name: "IX_employees_IdentityId",
                table: "tbl_employees",
                newName: "IX_tbl_employees_IdentityId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tbl_employees",
                table: "tbl_employees",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_employees_AspNetUsers_IdentityId",
                table: "tbl_employees",
                column: "IdentityId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tbl_employees_AspNetUsers_IdentityId",
                table: "tbl_employees");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tbl_employees",
                table: "tbl_employees");

            migrationBuilder.RenameTable(
                name: "tbl_employees",
                newName: "employees");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_employees_IdentityId",
                table: "employees",
                newName: "IX_employees_IdentityId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_employees",
                table: "employees",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_employees_AspNetUsers_IdentityId",
                table: "employees",
                column: "IdentityId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
