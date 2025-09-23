CREATE TABLE "user" (
                        "id" uuid PRIMARY KEY,
                        "name" varchar NOT NULL,
                        "email" varchar UNIQUE NOT NULL,
                        "password_hash" varchar NOT NULL,
                        "created_at" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "perfil_usuario" (
                                  "id" uuid PRIMARY KEY,
                                  "user_id" uuid UNIQUE NOT NULL,
                                  "data_nascimento" date,
                                  "altura_cm" integer,
                                  "peso_kg" decimal(5,2),
                                  "genero" varchar
);

CREATE TABLE "habito" (
                          "id" uuid PRIMARY KEY,
                          "nome" varchar UNIQUE NOT NULL,
                          "descricao" text,
                          "categoria" varchar
);

CREATE TABLE "progresso_habito" (
                                    "id" uuid PRIMARY KEY,
                                    "user_id" uuid NOT NULL,
                                    "habito_id" uuid NOT NULL,
                                    "data_inicio" timestamp NOT NULL DEFAULT (now()),
                                    "meta_pessoal" text,
                                    "ultima_recaida" date,
                                    "custo_diario_habito" decimal(10,2)
);

CREATE TABLE "conquista" (
                             "id" uuid PRIMARY KEY,
                             "nome" varchar UNIQUE NOT NULL,
                             "descricao" text NOT NULL,
                             "icone_url" varchar
);

CREATE TABLE "user_conquista" (
                                  "id" uuid PRIMARY KEY,
                                  "user_id" uuid NOT NULL,
                                  "conquista_id" uuid NOT NULL,
                                  "data_conquista" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "doenca" (
                          "id" uuid PRIMARY KEY,
                          "nome" varchar UNIQUE NOT NULL
);

CREATE TABLE "user_doenca" (
                               "user_id" uuid NOT NULL,
                               "doenca_id" uuid NOT NULL,
                               PRIMARY KEY ("user_id", "doenca_id")
);

CREATE UNIQUE INDEX ON "user_conquista" ("user_id", "conquista_id");

ALTER TABLE "perfil_usuario" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "progresso_habito" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "progresso_habito" ADD FOREIGN KEY ("habito_id") REFERENCES "habito" ("id");

ALTER TABLE "user_conquista" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "user_conquista" ADD FOREIGN KEY ("conquista_id") REFERENCES "conquista" ("id");

ALTER TABLE "user_doenca" ADD FOREIGN KEY ("user_id") REFERENCES "user" ("id");

ALTER TABLE "user_doenca" ADD FOREIGN KEY ("doenca_id") REFERENCES "doenca" ("id");