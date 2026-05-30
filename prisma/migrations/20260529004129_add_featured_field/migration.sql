-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_stories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "coverImage" TEXT,
    "accentColor" TEXT NOT NULL DEFAULT 'bg-blue-500',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "moderationScore" INTEGER,
    "moderationFlags" TEXT,
    "rejectionReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "publishedAt" DATETIME,
    CONSTRAINT "stories_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_stories" ("accentColor", "authorId", "coverImage", "createdAt", "description", "genre", "id", "moderationFlags", "moderationScore", "publishedAt", "rejectionReason", "status", "subtitle", "title", "updatedAt") SELECT "accentColor", "authorId", "coverImage", "createdAt", "description", "genre", "id", "moderationFlags", "moderationScore", "publishedAt", "rejectionReason", "status", "subtitle", "title", "updatedAt" FROM "stories";
DROP TABLE "stories";
ALTER TABLE "new_stories" RENAME TO "stories";
CREATE INDEX "stories_authorId_idx" ON "stories"("authorId");
CREATE INDEX "stories_status_idx" ON "stories"("status");
CREATE INDEX "stories_publishedAt_idx" ON "stories"("publishedAt");
CREATE INDEX "stories_featured_idx" ON "stories"("featured");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
