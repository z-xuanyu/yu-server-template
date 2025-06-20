-- AlterTable
ALTER TABLE `sys_menu_meta` ADD COLUMN `activePath` VARCHAR(191) NULL DEFAULT '',
    ADD COLUMN `badgeType` VARCHAR(191) NULL DEFAULT 'normal',
    ADD COLUMN `badgeVariants` VARCHAR(191) NULL DEFAULT 'success',
    ADD COLUMN `iframeSrc` VARCHAR(191) NULL DEFAULT '',
    ADD COLUMN `noBasicLayout` BOOLEAN NULL DEFAULT false;
