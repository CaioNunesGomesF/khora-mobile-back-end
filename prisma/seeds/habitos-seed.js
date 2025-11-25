import { PrismaClient } from '../../src/generated/prisma/index.js';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

const habitos = [
  {
    id: randomUUID(),
    nome: "Parar de Fumar",
    descricao: "Abandonar o uso de cigarros e produtos de tabaco",
    categoria: "tabaco"
  },
  {
    id: randomUUID(),
    nome: "Reduzir Álcool",
    descricao: "Diminuir ou eliminar o consumo de bebidas alcoólicas",
    categoria: "alcool"
  },
  {
    id: randomUUID(),
    nome: "Parar de Beber",
    descricao: "Abandonar completamente o consumo de álcool",
    categoria: "alcool"
  },
  {
    id: randomUUID(),
    nome: "Evitar Junk Food",
    descricao: "Reduzir o consumo de alimentos ultraprocessados e fast food",
    categoria: "alimentacao"
  },
  {
    id: randomUUID(),
    nome: "Parar Jogos de Azar",
    descricao: "Abandonar apostas e jogos de azar",
    categoria: "jogos"
  },
  {
    id: randomUUID(),
    nome: "Reduzir Redes Sociais",
    descricao: "Diminuir o tempo gasto em redes sociais",
    categoria: "tecnologia"
  },
  {
    id: randomUUID(),
    nome: "Parar Refrigerante",
    descricao: "Abandonar o consumo de refrigerantes e bebidas açucaradas",
    categoria: "alimentacao"
  },
  {
    id: randomUUID(),
    nome: "Reduzir Café",
    descricao: "Diminuir o consumo excessivo de cafeína",
    categoria: "alimentacao"
  },
  {
    id: randomUUID(),
    nome: "Reduzir Pornografia",
    descricao: "Diminuir o consumo excessivo de pornografia",
    categoria: "vicio"
  }
];

async function seedHabitos() {
  console.log('🌱 Iniciando seed de hábitos...');

  for (const habito of habitos) {
    try {
      // Verificar se já existe
      const existente = await prisma.habito.findUnique({
        where: { nome: habito.nome }
      });

      if (!existente) {
        await prisma.habito.create({
          data: habito
        });
        console.log(`✅ Hábito criado: ${habito.nome}`);
      } else {
        console.log(`⏭️ Hábito já existe: ${habito.nome}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao criar hábito ${habito.nome}:`, error.message);
    }
  }

  console.log('🎉 Seed de hábitos concluído!');
}

seedHabitos()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
