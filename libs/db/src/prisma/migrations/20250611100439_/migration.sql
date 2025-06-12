-- CreateTable
CREATE TABLE `sys_dict_attr` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `label` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `remark` VARCHAR(191) NOT NULL,
    `sort` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `dictId` INTEGER NOT NULL,

    UNIQUE INDEX `sys_dict_attr_dictId_key`(`dictId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sys_dict` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `remark` VARCHAR(191) NOT NULL,
    `sort` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `createTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sys_dict_attr` ADD CONSTRAINT `sys_dict_attr_dictId_fkey` FOREIGN KEY (`dictId`) REFERENCES `sys_dict`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
