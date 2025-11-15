/*
  Warnings:

  - The primary key for the `Jornada` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ativa` on the `Jornada` table. All the data in the column will be lost.
  - You are about to drop the column `dataFim` on the `Jornada` table. All the data in the column will be lost.
  - You are about to drop the column `dataInicio` on the `Jornada` table. All the data in the column will be lost.
  - You are about to drop the column `titulo` on the `Jornada` table. All the data in the column will be lost.
  - You are about to drop the `Conquista` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ConquistaUsuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProgressoJornada` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `nome` to the `Jornada` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Jornada` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `Jornada` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "ConquistaUsuario" DROP CONSTRAINT "ConquistaUsuario_conquistaId_fkey";

-- DropForeignKey
ALTER TABLE "ConquistaUsuario" DROP CONSTRAINT "ConquistaUsuario_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "ProgressoJornada" DROP CONSTRAINT "ProgressoJornada_jornadaId_fkey";

-- DropForeignKey
ALTER TABLE "ProgressoJornada" DROP CONSTRAINT "ProgressoJornada_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Jornada" DROP CONSTRAINT "Jornada_pkey",
DROP COLUMN "ativa",
DROP COLUMN "dataFim",
DROP COLUMN "dataInicio",
DROP COLUMN "titulo",
ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "icone_url" VARCHAR(500),
ADD COLUMN     "nome" VARCHAR(200) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(6) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "descricao" DROP NOT NULL,
ADD CONSTRAINT "Jornada_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Conquista";

-- DropTable
DROP TABLE "ConquistaUsuario";

-- DropTable
DROP TABLE "ProgressoJornada";

-- CreateTable
CREATE TABLE "UserJornada" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "jornada_id" UUID NOT NULL,
    "progresso" INTEGER NOT NULL DEFAULT 0,
    "concluida" BOOLEAN NOT NULL DEFAULT false,
    "data_inicio" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_fim" TIMESTAMP(3),

    CONSTRAINT "UserJornada_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_jornada_user_id_jornada_id_idx" ON "UserJornada"("user_id", "jornada_id");

-- AddForeignKey
ALTER TABLE "UserJornada" ADD CONSTRAINT "UserJornada_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserJornada" ADD CONSTRAINT "UserJornada_jornada_id_fkey" FOREIGN KEY ("jornada_id") REFERENCES "Jornada"("id") ON DELETE CASCADE ON UPDATE CASCADE;
