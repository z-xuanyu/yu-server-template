-- DropForeignKey
ALTER TABLE `sys_dict_attr` DROP FOREIGN KEY `sys_dict_attr_dictId_fkey`;

-- DropIndex
DROP INDEX `sys_dict_attr_dictId_key` ON `sys_dict_attr`;

-- AddForeignKey
ALTER TABLE `sys_dict_attr` ADD CONSTRAINT `sys_dict_attr_dictId_fkey` FOREIGN KEY (`dictId`) REFERENCES `sys_dict`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
