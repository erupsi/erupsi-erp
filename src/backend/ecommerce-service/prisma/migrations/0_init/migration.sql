-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."cart" (
    "id_cart" UUID NOT NULL,
    "id_user" UUID NOT NULL,
    "id_pos" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "cart_pkey" PRIMARY KEY ("id_cart")
);

-- CreateTable
CREATE TABLE "public"."checkout" (
    "id_checkout" UUID NOT NULL,
    "id_user" UUID NOT NULL,
    "ispayed" BOOLEAN NOT NULL DEFAULT false,
    "iscancelled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "checkout_pkey" PRIMARY KEY ("id_checkout")
);

-- CreateTable
CREATE TABLE "public"."checkoutitem" (
    "id_coi" UUID NOT NULL,
    "id_checkout" UUID NOT NULL,
    "id_product" UUID NOT NULL,
    "id_warehouse" UUID NOT NULL,
    "quantity" INTEGER,

    CONSTRAINT "checkoutitem_pkey" PRIMARY KEY ("id_coi")
);

-- CreateTable
CREATE TABLE "public"."log" (
    "id_log" UUID NOT NULL,
    "id_user" UUID NOT NULL,
    "activity" VARCHAR(255) NOT NULL,
    "act_detail" TEXT,
    "timestamp" TIMESTAMP(6),

    CONSTRAINT "log_pkey" PRIMARY KEY ("id_log")
);

-- CreateTable
CREATE TABLE "public"."productonsale" (
    "id_pos" UUID NOT NULL,
    "id_productvariant" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "price" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "isavailable" BOOLEAN,

    CONSTRAINT "productonsale_pkey" PRIMARY KEY ("id_pos")
);

-- CreateTable
CREATE TABLE "public"."transaksi" (
    "id_transaksi" UUID NOT NULL,
    "id_checkout" UUID NOT NULL,
    "iscancelled" BOOLEAN NOT NULL DEFAULT false,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "transaksi_pkey" PRIMARY KEY ("id_transaksi")
);

-- AddForeignKey
ALTER TABLE "public"."cart" ADD CONSTRAINT "fk_post" FOREIGN KEY ("id_pos") REFERENCES "public"."productonsale"("id_pos") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."checkoutitem" ADD CONSTRAINT "fk_checkout" FOREIGN KEY ("id_checkout") REFERENCES "public"."checkout"("id_checkout") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."checkoutitem" ADD CONSTRAINT "fk_product" FOREIGN KEY ("id_product") REFERENCES "public"."productonsale"("id_pos") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."transaksi" ADD CONSTRAINT "fk_checkout" FOREIGN KEY ("id_checkout") REFERENCES "public"."checkout"("id_checkout") ON DELETE NO ACTION ON UPDATE NO ACTION;

