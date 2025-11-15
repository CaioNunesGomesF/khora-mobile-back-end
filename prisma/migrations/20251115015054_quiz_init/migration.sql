-- CreateTable
CREATE TABLE "conquista" (
    "id" UUID NOT NULL,
    "nome" VARCHAR NOT NULL,
    "descricao" TEXT NOT NULL,
    "icone_url" VARCHAR,

    CONSTRAINT "conquista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doenca" (
    "id" UUID NOT NULL,
    "nome" VARCHAR NOT NULL,

    CONSTRAINT "doenca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habito" (
    "id" UUID NOT NULL,
    "nome" VARCHAR NOT NULL,
    "descricao" TEXT,
    "categoria" VARCHAR,

    CONSTRAINT "habito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "perfil_usuario" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "data_nascimento" DATE,
    "altura_cm" INTEGER,
    "peso_kg" DECIMAL(5,2),
    "genero" VARCHAR,

    CONSTRAINT "perfil_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progresso_habito" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "habito_id" UUID NOT NULL,
    "data_inicio" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meta_pessoal" TEXT,
    "ultima_recaida" DATE,
    "custo_diario_habito" DECIMAL(10,2),

    CONSTRAINT "progresso_habito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password_hash" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Challenge" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChallengeParticipant" (
    "id" SERIAL NOT NULL,
    "challengeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ChallengeParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_conquista" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "conquista_id" UUID NOT NULL,
    "data_conquista" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_conquista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizOption" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "QuizOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_doenca" (
    "user_id" UUID NOT NULL,
    "doenca_id" UUID NOT NULL,

    CONSTRAINT "user_doenca_pkey" PRIMARY KEY ("user_id","doenca_id")
);

-- CreateTable
CREATE TABLE "categoria_conteudo" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "descricao" TEXT,
    "icone_url" VARCHAR(500),
    "cor_hex" VARCHAR(7),
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "categoria_conteudo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipo_conteudo" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "icone" VARCHAR(50),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tipo_conteudo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conteudo" (
    "id" UUID NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "descricao_curta" VARCHAR(500) NOT NULL,
    "conteudo_completo" TEXT,
    "url_externa" VARCHAR(1000),
    "thumbnail_url" VARCHAR(500),
    "duracao_minutos" INTEGER,
    "nivel_dificuldade" VARCHAR(20),
    "autor" VARCHAR(100),
    "fonte_credivel" VARCHAR(200),
    "categoria_id" UUID NOT NULL,
    "tipo_conteudo_id" UUID NOT NULL,
    "visualizacoes" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "conteudo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "cor_hex" VARCHAR(7),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conteudo_tag" (
    "conteudo_id" UUID NOT NULL,
    "tag_id" UUID NOT NULL,

    CONSTRAINT "conteudo_tag_pkey" PRIMARY KEY ("conteudo_id","tag_id")
);

-- CreateTable
CREATE TABLE "avaliacao_conteudo" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "conteudo_id" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "comentario" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "avaliacao_conteudo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminder_setting" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "frequency_days" INTEGER,
    "next_send" TIMESTAMP(3),
    "fcm_token" VARCHAR(500),

    CONSTRAINT "reminder_setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_checkup" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "nome" VARCHAR(200) NOT NULL,
    "descricao" TEXT,
    "data_prevista" TIMESTAMP(6) NOT NULL,
    "lembrete_ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_checkup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum_topico" (
    "id" UUID NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "descricao" TEXT,
    "created_by" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forum_topico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum_post" (
    "id" UUID NOT NULL,
    "topico_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "conteudo" TEXT NOT NULL,
    "is_removed" BOOLEAN NOT NULL DEFAULT false,
    "removed_at" TIMESTAMP(3),
    "removed_by" UUID,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forum_post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum_resposta" (
    "id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "conteudo" TEXT NOT NULL,
    "is_removed" BOOLEAN NOT NULL DEFAULT false,
    "removed_at" TIMESTAMP(3),
    "removed_by" UUID,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forum_resposta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forum_pseudonimo" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "topico_id" UUID NOT NULL,
    "pseudonimo" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forum_pseudonimo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "conquista_nome_key" ON "conquista"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "doenca_nome_key" ON "doenca"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "habito_nome_key" ON "habito"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "perfil_usuario_user_id_key" ON "perfil_usuario"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_conquista_user_id_conquista_id_idx" ON "user_conquista"("user_id", "conquista_id");

-- CreateIndex
CREATE UNIQUE INDEX "categoria_conteudo_nome_key" ON "categoria_conteudo"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "tipo_conteudo_nome_key" ON "tipo_conteudo"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "tag_nome_key" ON "tag"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "avaliacao_conteudo_user_id_conteudo_id_key" ON "avaliacao_conteudo"("user_id", "conteudo_id");

-- CreateIndex
CREATE UNIQUE INDEX "reminder_setting_user_id_key" ON "reminder_setting"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "forum_pseudonimo_user_topico_idx" ON "forum_pseudonimo"("user_id", "topico_id");

-- AddForeignKey
ALTER TABLE "perfil_usuario" ADD CONSTRAINT "perfil_usuario_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "progresso_habito" ADD CONSTRAINT "progresso_habito_habito_id_fkey" FOREIGN KEY ("habito_id") REFERENCES "habito"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "progresso_habito" ADD CONSTRAINT "progresso_habito_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChallengeParticipant" ADD CONSTRAINT "ChallengeParticipant_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_conquista" ADD CONSTRAINT "user_conquista_conquista_id_fkey" FOREIGN KEY ("conquista_id") REFERENCES "conquista"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_conquista" ADD CONSTRAINT "user_conquista_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "QuizOption" ADD CONSTRAINT "QuizOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_doenca" ADD CONSTRAINT "user_doenca_doenca_id_fkey" FOREIGN KEY ("doenca_id") REFERENCES "doenca"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_doenca" ADD CONSTRAINT "user_doenca_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "conteudo" ADD CONSTRAINT "conteudo_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categoria_conteudo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conteudo" ADD CONSTRAINT "conteudo_tipo_conteudo_id_fkey" FOREIGN KEY ("tipo_conteudo_id") REFERENCES "tipo_conteudo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conteudo_tag" ADD CONSTRAINT "conteudo_tag_conteudo_id_fkey" FOREIGN KEY ("conteudo_id") REFERENCES "conteudo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conteudo_tag" ADD CONSTRAINT "conteudo_tag_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao_conteudo" ADD CONSTRAINT "avaliacao_conteudo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacao_conteudo" ADD CONSTRAINT "avaliacao_conteudo_conteudo_id_fkey" FOREIGN KEY ("conteudo_id") REFERENCES "conteudo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reminder_setting" ADD CONSTRAINT "reminder_setting_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_checkup" ADD CONSTRAINT "user_checkup_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_topico" ADD CONSTRAINT "forum_topico_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "forum_post" ADD CONSTRAINT "forum_post_topico_id_fkey" FOREIGN KEY ("topico_id") REFERENCES "forum_topico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_post" ADD CONSTRAINT "forum_post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "forum_resposta" ADD CONSTRAINT "forum_resposta_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "forum_post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_resposta" ADD CONSTRAINT "forum_resposta_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "forum_pseudonimo" ADD CONSTRAINT "forum_pseudonimo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forum_pseudonimo" ADD CONSTRAINT "forum_pseudonimo_topico_id_fkey" FOREIGN KEY ("topico_id") REFERENCES "forum_topico"("id") ON DELETE CASCADE ON UPDATE CASCADE;
