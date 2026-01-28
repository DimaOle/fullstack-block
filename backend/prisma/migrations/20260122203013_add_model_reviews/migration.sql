/*
  Warnings:

  - You are about to drop the column `reting` on the `songs` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "songs" DROP COLUMN "reting",
ADD COLUMN     "rating" DECIMAL(10,1) DEFAULT 0;

-- CreateTable
CREATE TABLE "reviews" (
    "id" INTEGER NOT NULL,
    "song_id" INTEGER NOT NULL,
    "comment" TEXT,
    "user_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "reviews_user_id_song_id_key" ON "reviews"("user_id", "song_id");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_song_id_fkey" FOREIGN KEY ("song_id") REFERENCES "songs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
