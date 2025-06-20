/*
  Warnings:

  - You are about to drop the column `createTime` on the `sys_dict` table. All the data in the column will be lost.
  - You are about to drop the column `updateTime` on the `sys_dict` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `sys_role_menu` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `sys_user_role` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `sys_dict` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `sys_dict_attr` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `sys_dict` DROP COLUMN `createTime`,
    DROP COLUMN `updateTime`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `sys_dict_attr` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `sys_role_menu` DROP COLUMN `createdAt`;

-- AlterTable
ALTER TABLE `sys_user_role` DROP COLUMN `createdAt`;
