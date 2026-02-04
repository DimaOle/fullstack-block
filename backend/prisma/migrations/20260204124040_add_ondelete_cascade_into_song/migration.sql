-- DropForeignKey
ALTER TABLE "songs" DROP CONSTRAINT "songs_user_id_fkey";

-- AddForeignKey
ALTER TABLE "songs" ADD CONSTRAINT "songs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
