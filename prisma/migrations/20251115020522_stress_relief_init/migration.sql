-- CreateTable
CREATE TABLE "BreathingExercise" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "steps" TEXT NOT NULL,

    CONSTRAINT "BreathingExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelaxingAudio" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "RelaxingAudio_pkey" PRIMARY KEY ("id")
);
