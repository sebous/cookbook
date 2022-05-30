-- CreateTable
CREATE TABLE "Recipe" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "parsedName" STRING NOT NULL,
    "htmlBody" STRING NOT NULL,
    "markdownBody" STRING NOT NULL,
    "url" STRING NOT NULL,
    "userNotes" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);
