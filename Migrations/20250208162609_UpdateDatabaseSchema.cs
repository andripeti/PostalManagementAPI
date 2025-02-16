using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PostalManagementAPI.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDatabaseSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TrackingHistories_AspNetUsers_HolderId",
                table: "TrackingHistories");

            migrationBuilder.DropForeignKey(
                name: "FK_TrackingHistories_tbl_deliveries_DeliveryId",
                table: "TrackingHistories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TrackingHistories",
                table: "TrackingHistories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PackageHolders",
                table: "PackageHolders");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Offices",
                table: "Offices");

            migrationBuilder.RenameTable(
                name: "TrackingHistories",
                newName: "tbl_tracking_histories");

            migrationBuilder.RenameTable(
                name: "PackageHolders",
                newName: "tbl_package_holders");

            migrationBuilder.RenameTable(
                name: "Offices",
                newName: "tbl_offices");

            migrationBuilder.RenameIndex(
                name: "IX_TrackingHistories_HolderId",
                table: "tbl_tracking_histories",
                newName: "IX_tbl_tracking_histories_HolderId");

            migrationBuilder.RenameIndex(
                name: "IX_TrackingHistories_DeliveryId",
                table: "tbl_tracking_histories",
                newName: "IX_tbl_tracking_histories_DeliveryId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tbl_tracking_histories",
                table: "tbl_tracking_histories",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tbl_package_holders",
                table: "tbl_package_holders",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tbl_offices",
                table: "tbl_offices",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_tracking_histories_AspNetUsers_HolderId",
                table: "tbl_tracking_histories",
                column: "HolderId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_tbl_tracking_histories_tbl_deliveries_DeliveryId",
                table: "tbl_tracking_histories",
                column: "DeliveryId",
                principalTable: "tbl_deliveries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tbl_tracking_histories_AspNetUsers_HolderId",
                table: "tbl_tracking_histories");

            migrationBuilder.DropForeignKey(
                name: "FK_tbl_tracking_histories_tbl_deliveries_DeliveryId",
                table: "tbl_tracking_histories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tbl_tracking_histories",
                table: "tbl_tracking_histories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tbl_package_holders",
                table: "tbl_package_holders");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tbl_offices",
                table: "tbl_offices");

            migrationBuilder.RenameTable(
                name: "tbl_tracking_histories",
                newName: "TrackingHistories");

            migrationBuilder.RenameTable(
                name: "tbl_package_holders",
                newName: "PackageHolders");

            migrationBuilder.RenameTable(
                name: "tbl_offices",
                newName: "Offices");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_tracking_histories_HolderId",
                table: "TrackingHistories",
                newName: "IX_TrackingHistories_HolderId");

            migrationBuilder.RenameIndex(
                name: "IX_tbl_tracking_histories_DeliveryId",
                table: "TrackingHistories",
                newName: "IX_TrackingHistories_DeliveryId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TrackingHistories",
                table: "TrackingHistories",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PackageHolders",
                table: "PackageHolders",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Offices",
                table: "Offices",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TrackingHistories_AspNetUsers_HolderId",
                table: "TrackingHistories",
                column: "HolderId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TrackingHistories_tbl_deliveries_DeliveryId",
                table: "TrackingHistories",
                column: "DeliveryId",
                principalTable: "tbl_deliveries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
