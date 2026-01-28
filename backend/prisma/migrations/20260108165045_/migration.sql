/*
  Warnings:

  - The values [UPD] on the enum `ProviderEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProviderEnum_new" AS ENUM ('LOCAL', 'GOOGLE', 'GITHUB');
ALTER TABLE "users" ALTER COLUMN "provider" TYPE "ProviderEnum_new" USING ("provider"::text::"ProviderEnum_new");
ALTER TYPE "ProviderEnum" RENAME TO "ProviderEnum_old";
ALTER TYPE "ProviderEnum_new" RENAME TO "ProviderEnum";
DROP TYPE "ProviderEnum_old";
COMMIT;
