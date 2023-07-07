/*
  Warnings:

  - You are about to drop the `genre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `itemsongenres` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categ_id` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `itemsongenres` DROP FOREIGN KEY `ItemsOnGenres_genreId_fkey`;

-- DropForeignKey
ALTER TABLE `itemsongenres` DROP FOREIGN KEY `ItemsOnGenres_itemId_fkey`;

-- AlterTable
ALTER TABLE `items` ADD COLUMN `categ_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `genre`;

-- DropTable
DROP TABLE `itemsongenres`;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_categ_id_fkey` FOREIGN KEY (`categ_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
