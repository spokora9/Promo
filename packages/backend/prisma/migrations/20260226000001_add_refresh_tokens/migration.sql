-- CreateTable: refresh_tokens for JWT revocation support
CREATE TABLE "refresh_tokens" (
    "id"           TEXT NOT NULL,
    "jti"          TEXT NOT NULL,
    "subject_id"   TEXT NOT NULL,
    "subject_type" TEXT NOT NULL,
    "expires_at"   TIMESTAMP(3) NOT NULL,
    "revoked_at"   TIMESTAMP(3),
    "created_at"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_jti_key" ON "refresh_tokens"("jti");

-- CreateIndex
CREATE INDEX "refresh_tokens_subject_id_subject_type_idx" ON "refresh_tokens"("subject_id", "subject_type");

-- CreateIndex
CREATE INDEX "refresh_tokens_expires_at_idx" ON "refresh_tokens"("expires_at");
