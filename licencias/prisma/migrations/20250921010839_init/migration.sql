-- CreateTable
CREATE TABLE "public"."License" (
    "folio" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "diagnosis" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "days" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "License_pkey" PRIMARY KEY ("folio")
);
