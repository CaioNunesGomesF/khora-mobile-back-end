-- CreateTable
CREATE TABLE "Jornada" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "dataInicio" TIMESTAMP(3),
    "dataFim" TIMESTAMP(3),

    CONSTRAINT "Jornada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressoJornada" (
    "id" SERIAL NOT NULL,
    "usuarioId" UUID NOT NULL,
    "jornadaId" INTEGER NOT NULL,
    "progresso" INTEGER NOT NULL DEFAULT 0,
    "concluida" BOOLEAN NOT NULL DEFAULT false,
    "dataInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataFim" TIMESTAMP(3),

    CONSTRAINT "ProgressoJornada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conquista" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipoGatilho" TEXT NOT NULL,
    "valorGatilho" INTEGER NOT NULL,

    CONSTRAINT "Conquista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConquistaUsuario" (
    "id" SERIAL NOT NULL,
    "usuarioId" UUID NOT NULL,
    "conquistaId" INTEGER NOT NULL,
    "dataConquista" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConquistaUsuario_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProgressoJornada" ADD CONSTRAINT "ProgressoJornada_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressoJornada" ADD CONSTRAINT "ProgressoJornada_jornadaId_fkey" FOREIGN KEY ("jornadaId") REFERENCES "Jornada"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConquistaUsuario" ADD CONSTRAINT "ConquistaUsuario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConquistaUsuario" ADD CONSTRAINT "ConquistaUsuario_conquistaId_fkey" FOREIGN KEY ("conquistaId") REFERENCES "Conquista"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
