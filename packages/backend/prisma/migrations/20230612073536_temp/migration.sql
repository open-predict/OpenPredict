-- CreateTable
CREATE TABLE "MarketTrade" (
    "txId" BYTEA NOT NULL,
    "instructionNo" INTEGER NOT NULL,
    "slot" INTEGER NOT NULL,
    "blockTime" INTEGER NOT NULL,
    "retrievalTime" TIMESTAMP(3) NOT NULL,
    "ammAddress" BYTEA NOT NULL,
    "userKey" BYTEA NOT NULL,
    "nanoUSDC" BIGINT NOT NULL,
    "direction" BOOLEAN NOT NULL,
    "expectedShares" BIGINT NOT NULL,
    "drift" BIGINT NOT NULL,

    CONSTRAINT "MarketTrade_pkey" PRIMARY KEY ("txId","instructionNo")
);

-- CreateTable
CREATE TABLE "MarketData" (
    "ammAddress" BYTEA NOT NULL,
    "version" INTEGER NOT NULL,
    "resolved" BOOLEAN,
    "subsidy" BIGINT NOT NULL,
    "yes" BIGINT NOT NULL,
    "no" BIGINT NOT NULL,
    "ipfsCid" BYTEA NOT NULL,
    "operatorKey" BYTEA NOT NULL,

    CONSTRAINT "MarketData_pkey" PRIMARY KEY ("ammAddress")
);

-- CreateTable
CREATE TABLE "MarketDataSnapshot" (
    "ammAddress" BYTEA NOT NULL,
    "retrievalTime" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL,
    "resolved" BOOLEAN,
    "subsidy" BIGINT NOT NULL,
    "yes" BIGINT NOT NULL,
    "no" BIGINT NOT NULL,
    "ipfsCid" BYTEA NOT NULL,
    "operatorKey" BYTEA NOT NULL,

    CONSTRAINT "MarketDataSnapshot_pkey" PRIMARY KEY ("ammAddress","retrievalTime")
);

-- CreateIndex
CREATE INDEX "MarketTrade_txId_idx" ON "MarketTrade" USING HASH ("txId");

-- CreateIndex
CREATE INDEX "MarketTrade_retrievalTime_idx" ON "MarketTrade"("retrievalTime");

-- CreateIndex
CREATE INDEX "MarketTrade_slot_idx" ON "MarketTrade"("slot");

-- CreateIndex
CREATE INDEX "MarketTrade_blockTime_idx" ON "MarketTrade"("blockTime");

-- CreateIndex
CREATE INDEX "MarketTrade_userKey_idx" ON "MarketTrade" USING HASH ("userKey");

-- CreateIndex
CREATE INDEX "MarketData_operatorKey_idx" ON "MarketData" USING HASH ("operatorKey");

-- CreateIndex
CREATE INDEX "MarketDataSnapshot_operatorKey_idx" ON "MarketDataSnapshot" USING HASH ("operatorKey");

-- CreateIndex
CREATE INDEX "MarketDataSnapshot_ammAddress_idx" ON "MarketDataSnapshot" USING HASH ("ammAddress");

-- CreateIndex
CREATE INDEX "MarketDataSnapshot_retrievalTime_idx" ON "MarketDataSnapshot"("retrievalTime");

-- AddForeignKey
ALTER TABLE "MarketTrade" ADD CONSTRAINT "MarketTrade_ammAddress_fkey" FOREIGN KEY ("ammAddress") REFERENCES "MarketData"("ammAddress") ON DELETE RESTRICT ON UPDATE CASCADE;
