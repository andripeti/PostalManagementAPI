using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PostalManagementAPI.Migrations
{
    /// <inheritdoc />
    public partial class FixedMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IdentityId",
                table: "tbl_employees");

            migrationBuilder.DropColumn(
                name: "AddressId",
                table: "tbl_deliveries");

            migrationBuilder.DropColumn(
                name: "RecipientId",
                table: "tbl_deliveries");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "tbl_employees",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<int>(
                name: "SenderId",
                table: "tbl_deliveries",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<float>(
                name: "PackageHeight",
                table: "tbl_deliveries",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "PackageLength",
                table: "tbl_deliveries",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "PackageType",
                table: "tbl_deliveries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<float>(
                name: "PackageWeight",
                table: "tbl_deliveries",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "PackageWidth",
                table: "tbl_deliveries",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "ReciepientName",
                table: "tbl_deliveries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RecipientCity",
                table: "tbl_deliveries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RecipientCountry",
                table: "tbl_deliveries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RecipientEmail",
                table: "tbl_deliveries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RecipientPhone",
                table: "tbl_deliveries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RecipientState",
                table: "tbl_deliveries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RecipientStreet",
                table: "tbl_deliveries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RecipientZipCode",
                table: "tbl_deliveries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SenderCity",
                table: "tbl_deliveries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SenderCountry",
                table: "tbl_deliveries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SenderEmail",
                table: "tbl_deliveries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SenderName",
                table: "tbl_deliveries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SenderPhone",
                table: "tbl_deliveries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SenderState",
                table: "tbl_deliveries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SenderStreet",
                table: "tbl_deliveries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SenderZipCode",
                table: "tbl_deliveries",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "tbl_addresses",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "tbl_employee_offices",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Position = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EmployeeId = table.Column<int>(type: "int", nullable: false),
                    OfficeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_employee_offices", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tbl_offices_AddressId",
                table: "tbl_offices",
                column: "AddressId");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_offices_tbl_addresses_AddressId",
                table: "tbl_offices",
                column: "AddressId",
                principalTable: "tbl_addresses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tbl_offices_tbl_addresses_AddressId",
                table: "tbl_offices");

            migrationBuilder.DropTable(
                name: "tbl_employee_offices");

            migrationBuilder.DropIndex(
                name: "IX_tbl_offices_AddressId",
                table: "tbl_offices");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "tbl_employees");

            migrationBuilder.DropColumn(
                name: "PackageHeight",
                table: "tbl_deliveries");

            migrationBuilder.DropColumn(
                name: "PackageLength",
                table: "tbl_deliveries");

            migrationBuilder.DropColumn(
                name: "PackageType",
                table: "tbl_deliveries");

            migrationBuilder.DropColumn(
                name: "PackageWeight",
                table: "tbl_deliveries");

            migrationBuilder.DropColumn(
                name: "PackageWidth",
                table: "tbl_deliveries");

            migrationBuilder.DropColumn(
                name: "ReciepientName",
                table: "tbl_deliveries");

            migrationBuilder.DropColumn(
                name: "RecipientCity",
                table: "tbl_deliveries");

            migrationBuilder.DropColumn(
                name: "RecipientCountry",
                table: "tbl_deliveries");

            migrationBuilder.DropColumn(
                name: "RecipientEmail",
                table: "tbl_deliveries");

            migrationBuilder.DropColumn(
                name: "RecipientPhone",
                table: "tbl_deliveries");

            migrationBuilder.DropColumn(
                name: "RecipientState",
                table: "tbl_deliveries");

            migrationBuilder.DropColumn(
                name: "RecipientStreet",
                table: "tbl_deliveries");

            migrationBuilder.DropColumn(
                name: "RecipientZipCode",
                table: "tbl_deliveries");

            migrationBuilder.DropColumn(
                name: "SenderCity",
                table: "tbl_deliveries");

            migrationBuilder.DropColumn(
                name: "SenderCountry",
                table: "tbl_deliveries");

            migrationBuilder.DropColumn(
                name: "SenderEmail",
                table: "tbl_deliveries");

            migrationBuilder.DropColumn(
                name: "SenderName",
                table: "tbl_deliveries");

            migrationBuilder.DropColumn(
                name: "SenderPhone",
                table: "tbl_deliveries");

            migrationBuilder.DropColumn(
                name: "SenderState",
                table: "tbl_deliveries");

            migrationBuilder.DropColumn(
                name: "SenderStreet",
                table: "tbl_deliveries");

            migrationBuilder.DropColumn(
                name: "SenderZipCode",
                table: "tbl_deliveries");

            migrationBuilder.DropColumn(
                name: "State",
                table: "tbl_addresses");

            migrationBuilder.AddColumn<string>(
                name: "IdentityId",
                table: "tbl_employees",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<int>(
                name: "SenderId",
                table: "tbl_deliveries",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AddressId",
                table: "tbl_deliveries",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RecipientId",
                table: "tbl_deliveries",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
