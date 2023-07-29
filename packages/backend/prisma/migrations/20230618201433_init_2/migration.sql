-- CreateTable
CREATE TABLE "Cookies" (
    "sessionId" TEXT NOT NULL,
    "sessionSecret" TEXT NOT NULL,
    "userKey" BYTEA NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cookies_pkey" PRIMARY KEY ("sessionId")
);

-- CreateTable
CREATE TABLE "MarketComment" (
    "id" TEXT NOT NULL,
    "ammAddress" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userKey" BYTEA NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "MarketComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MarketComment_createdAt_idx" ON "MarketComment"("createdAt");

-- CreateIndex
CREATE INDEX "MarketComment_ammAddress_idx" ON "MarketComment" USING HASH ("ammAddress");

-- CreateIndex
CREATE INDEX "MarketComment_userKey_idx" ON "MarketComment" USING HASH ("userKey");
