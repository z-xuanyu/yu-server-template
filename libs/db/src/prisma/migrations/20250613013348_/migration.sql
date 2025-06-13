/*
  Warnings:

  - You are about to drop the `sys_account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sys_account_role` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `sys_account` DROP FOREIGN KEY `sys_account_deptId_fkey`;

-- DropForeignKey
ALTER TABLE `sys_account_role` DROP FOREIGN KEY `sys_account_role_accountId_fkey`;

-- DropForeignKey
ALTER TABLE `sys_account_role` DROP FOREIGN KEY `sys_account_role_roleId_fkey`;

-- DropTable
DROP TABLE `sys_account`;

-- DropTable
DROP TABLE `sys_account_role`;

-- CreateTable
CREATE TABLE `sys_user_role` (
    `userId` INTEGER NOT NULL,
    `roleId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`userId`, `roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `avatar` VARCHAR(191) NOT NULL DEFAULT '',
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `deptId` INTEGER NULL,
    `status` INTEGER NOT NULL DEFAULT 1,
    `remark` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sys_user_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sys_user_role` ADD CONSTRAINT `sys_user_role_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `sys_user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sys_user_role` ADD CONSTRAINT `sys_user_role_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `sys_role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sys_user` ADD CONSTRAINT `sys_user_deptId_fkey` FOREIGN KEY (`deptId`) REFERENCES `sys_dept`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
