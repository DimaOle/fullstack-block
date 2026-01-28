-- AlterTable
CREATE SEQUENCE reviews_id_seq;
ALTER TABLE "reviews" ALTER COLUMN "id" SET DEFAULT nextval('reviews_id_seq'),
ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");
ALTER SEQUENCE reviews_id_seq OWNED BY "reviews"."id";
