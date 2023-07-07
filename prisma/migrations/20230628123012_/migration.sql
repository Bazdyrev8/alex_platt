/*
  Warnings:

  - You are about to alter the column `description` on the `items` table. The data in that column could be lost. The data in that column will be cast from `VarChar(2000)` to `VarChar(1025)`.

*/
-- AlterTable
ALTER TABLE `items` MODIFY `description` VARCHAR(1025) NOT NULL;

-- CreateTable
CREATE TABLE `comments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `author` VARCHAR(255) NOT NULL,
    `description` VARCHAR(1025) NOT NULL,
    `item_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
