-- CreateTable
CREATE TABLE "MarketMeta" (
    "ammAddress" BYTEA NOT NULL,
    "meta" BYTEA NOT NULL,

    CONSTRAINT "MarketMeta_pkey" PRIMARY KEY ("ammAddress")
);
