/*
  Warnings:

  - You are about to alter the column `type` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(2)`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `password` VARCHAR(255) NULL,
    MODIFY `username` VARCHAR(255) NULL,
    MODIFY `type` VARCHAR(2) NOT NULL;
