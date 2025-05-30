-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "names" TEXT,
    "paternalSurname" TEXT,
    "maternalSurname" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "enrollmentId" TEXT,
    "currentGroup" TEXT,
    "nextGroup" TEXT,
    "clubId" INTEGER,
    "shift" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "type" TEXT NOT NULL,
    "groups" TEXT[],
    "grade" TEXT,
    "permissions" JSONB NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Professor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "paternalSurname" TEXT NOT NULL,
    "maternalSurname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Professor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT[],
    "videos" TEXT[],
    "limit" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "groupNumber" INTEGER,
    "subjects" INTEGER[],

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Training" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT[],
    "videos" TEXT[],
    "shift" TEXT NOT NULL,
    "limit" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "professor" TEXT,
    "groupNumber" INTEGER,

    CONSTRAINT "Training_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Club" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT[],
    "videos" TEXT[],
    "limit" INTEGER NOT NULL,
    "shift" TEXT,
    "schedule" TEXT NOT NULL,
    "professorId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "groupNumber" INTEGER,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageSelection" (
    "id" SERIAL NOT NULL,
    "max" INTEGER NOT NULL,
    "min" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "selectionConfigId" INTEGER NOT NULL,

    CONSTRAINT "PackageSelection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelectionConfig" (
    "id" SERIAL NOT NULL,
    "groups" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "clubSelection" TIMESTAMP(3),

    CONSTRAINT "SelectionConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingSelection" (
    "id" SERIAL NOT NULL,
    "max" INTEGER NOT NULL,
    "min" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "selectionConfigId" INTEGER NOT NULL,

    CONSTRAINT "TrainingSelection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_enrollmentId_key" ON "User"("enrollmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Professor_email_key" ON "Professor"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageSelection" ADD CONSTRAINT "PackageSelection_selectionConfigId_fkey" FOREIGN KEY ("selectionConfigId") REFERENCES "SelectionConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingSelection" ADD CONSTRAINT "TrainingSelection_selectionConfigId_fkey" FOREIGN KEY ("selectionConfigId") REFERENCES "SelectionConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
