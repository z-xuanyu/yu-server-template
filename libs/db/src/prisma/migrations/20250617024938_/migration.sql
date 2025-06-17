/*
  Warnings:

  - You are about to drop the `sys_menu_permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sys_permission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sys_role_permission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `sys_menu_permission` DROP FOREIGN KEY `sys_menu_permission_menuId_fkey`;

-- DropForeignKey
ALTER TABLE `sys_menu_permission` DROP FOREIGN KEY `sys_menu_permission_permissionId_fkey`;

-- DropForeignKey
ALTER TABLE `sys_role_permission` DROP FOREIGN KEY `sys_role_permission_permissionId_fkey`;

-- DropForeignKey
ALTER TABLE `sys_role_permission` DROP FOREIGN KEY `sys_role_permission_roleId_fkey`;

-- AlterTable
ALTER TABLE `sys_menu` ADD COLUMN `authCode` VARCHAR(191) NULL DEFAULT '',
    ADD COLUMN `type` VARCHAR(191) NOT NULL DEFAULT 'catalog',
    MODIFY `path` VARCHAR(191) NULL DEFAULT '',
    MODIFY `component` VARCHAR(191) NULL DEFAULT '',
    MODIFY `redirect` VARCHAR(191) NULL DEFAULT '';

-- DropTable
DROP TABLE `sys_menu_permission`;

-- DropTable
DROP TABLE `sys_permission`;

-- DropTable
DROP TABLE `sys_role_permission`;
