-- CreateTable
CREATE TABLE "MarketLike" (
    "ammAddress" BYTEA NOT NULL,
    "userKey" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketLike_pkey" PRIMARY KEY ("ammAddress","userKey")
);
