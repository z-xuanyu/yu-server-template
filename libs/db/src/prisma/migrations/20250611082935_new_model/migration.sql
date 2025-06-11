-- AlterTable
ALTER TABLE `sys_account` ADD COLUMN `deptId` INTEGER NULL,
    ADD COLUMN `remark` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `status` INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE `sys_dept` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `parentId` INTEGER NULL,
    `sort` INTEGER NOT NULL DEFAULT 0,
    `status` INTEGER NOT NULL DEFAULT 1,
    `remark` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sys_account` ADD CONSTRAINT `sys_account_deptId_fkey` FOREIGN KEY (`deptId`) REFERENCES `sys_dept`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sys_dept` ADD CONSTRAINT `sys_dept_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `sys_dept`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
