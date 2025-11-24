import { PrismaClient } from '../../src/generated/prisma/index.js';
const prisma = new PrismaClient();

async function seedConteudo() {
    try {
        // Criar tipos de conteúdo
        const tiposConteudo = await Promise.all([
            prisma.tipo_conteudo.create({ data: { nome: 'ARTIGO', icone: 'article' } }),
            prisma.tipo_conteudo.create({ data: { nome: 'VIDEO', icone: 'play_circle' } }),
            prisma.tipo_conteudo.create({ data: { nome: 'INFOGRAFICO', icone: 'image' } }),
            prisma.tipo_conteudo.create({ data: { nome: 'PODCAST', icone: 'headphones' } })
        ]);

        console.log('Tipos de conteúdo criados:', tiposConteudo.length);

        // Criar categorias
        const categorias = await Promise.all([
            prisma.categoria_conteudo.create({
                data: {
                    nome: 'Saúde Sexual',
                    descricao: 'Informações sobre saúde sexual masculina',
                    icone_url: 'https://example.com/sexual-health-icon.png',
                    cor_hex: '#FF6B6B',
                    ordem: 1
                }
            }),
            prisma.categoria_conteudo.create({
                data: {
                    nome: 'Saúde da Próstata',
                    descricao: 'Prevenção e cuidados com a próstata',
                    icone_url: 'https://example.com/prostate-icon.png',
                    cor_hex: '#4ECDC4',
                    ordem: 2
                }
            }),
            prisma.categoria_conteudo.create({
                data: {
                    nome: 'Saúde Mental',
                    descricao: 'Bem-estar mental e emocional',
                    icone_url: 'https://example.com/mental-health-icon.png',
                    cor_hex: '#45B7D1',
                    ordem: 3
                }
            }),
            prisma.categoria_conteudo.create({
                data: {
                    nome: 'Atividade Física',
                    descricao: 'Exercícios e condicionamento físico',
                    icone_url: 'https://example.com/fitness-icon.png',
                    cor_hex: '#96CEB4',
                    ordem: 4
                }
            }),
            prisma.categoria_conteudo.create({
                data: {
                    nome: 'Nutrição',
                    descricao: 'Alimentação e suplementação',
                    icone_url: 'https://example.com/nutrition-icon.png',
                    cor_hex: '#FECA57',
                    ordem: 5
                }
            })
        ]);

        console.log('Categorias criadas:', categorias.length);

        // Criar tags
        const tags = await Promise.all([
            prisma.tag.create({ data: { nome: 'prevenção', cor_hex: '#28a745' } }),
            prisma.tag.create({ data: { nome: 'sintomas', cor_hex: '#ffc107' } }),
            prisma.tag.create({ data: { nome: 'tratamento', cor_hex: '#17a2b8' } }),
            prisma.tag.create({ data: { nome: 'dicas', cor_hex: '#6f42c1' } }),
            prisma.tag.create({ data: { nome: 'mitos', cor_hex: '#fd7e14' } })
        ]);

        console.log('Tags criadas:', tags.length);

        // Criar conteúdos de exemplo
        const conteudos = [
            {
                titulo: 'Disfunção Erétil: Quebrando Tabus e Mitos',
                descricao_curta: 'Entenda as causas, tratamentos e como lidar com a disfunção erétil sem preconceitos.',
                conteudo_completo: `A disfunção erétil (DE) é mais comum do que muitos homens imaginam. Estudos mostram que cerca de 40% dos homens aos 40 anos e 70% aos 70 anos experimentam algum grau de DE.

## Principais Causas:
- Problemas cardiovasculares
- Diabetes
- Estresse e ansiedade
- Medicamentos
- Sedentarismo

## Tratamentos Disponíveis:
1. Medicamentos orais
2. Terapia psicológica
3. Mudanças no estilo de vida
4. Terapias alternativas

## Quebrando o Tabu:
É fundamental entender que a DE não é um sinal de "falta de masculinidade". É uma condição médica tratável que requer acompanhamento profissional.`,
                thumbnail_url: 'https://example.com/de-thumbnail.jpg',
                nivel_dificuldade: 'BASICO',
                autor: 'Dr. Carlos Silva',
                fonte_credivel: 'Sociedade Brasileira de Urologia',
                categoria_id: categorias[0].id,
                tipo_conteudo_id: tiposConteudo[0].id,
                destaque: true,
                ativo: true 
            },
            {
                titulo: 'Exame de Próstata: Por que Fazer e Como se Preparar',
                descricao_curta: 'Tudo o que você precisa saber sobre o exame de próstata, desde a importância até como se preparar.',
                url_externa: 'https://youtube.com/watch?v=exemplo-prostata',
                thumbnail_url: 'https://example.com/prostate-exam-thumbnail.jpg',
                duracao_minutos: 15,
                nivel_dificuldade: 'BASICO',
                autor: 'Dr. Roberto Santos',
                fonte_credivel: 'Instituto Nacional do Câncer',
                categoria_id: categorias[1].id,
                tipo_conteudo_id: tiposConteudo[1].id,
                ativo: true
            },
            {
                titulo: 'Ansiedade Masculina: Reconhecendo os Sinais',
                descricao_curta: 'Como identificar e lidar com a ansiedade, quebrando o estigma da saúde mental masculina.',
                conteudo_completo: `A ansiedade masculina frequentemente passa despercebida devido aos estereótipos sociais que associam vulnerabilidade emocional à "fraqueza".

## Sinais Comuns:
- Irritabilidade excessiva
- Problemas de sono
- Tensão muscular
- Evitação social
- Abuso de substâncias

## Estratégias de Enfrentamento:
1. Exercícios de respiração
2. Atividade física regular
3. Terapia cognitivo-comportamental
4. Rede de apoio

## Quebrando o Estigma:
Buscar ajuda é um ato de coragem, não de fraqueza.`,
                thumbnail_url: 'https://example.com/anxiety-thumbnail.jpg',
                nivel_dificuldade: 'INTERMEDIARIO',
                autor: 'Psicólogo João Mendes',
                fonte_credivel: 'Conselho Federal de Psicologia',
                categoria_id: categorias[2].id,
                tipo_conteudo_id: tiposConteudo[0].id,
                ativo: true
            },
            {
                titulo: 'Treino de Força para Homens Após os 40',
                descricao_curta: 'Como manter a massa muscular e força após os 40 anos com exercícios seguros e eficazes.',
                url_externa: 'https://youtube.com/watch?v=exemplo-treino-40',
                thumbnail_url: 'https://example.com/workout-40-thumbnail.jpg',
                duracao_minutos: 25,
                nivel_dificuldade: 'INTERMEDIARIO',
                autor: 'Prof. Marcos Fitness',
                fonte_credivel: 'Conselho Federal de Educação Física',
                categoria_id: categorias[3].id,
                tipo_conteudo_id: tiposConteudo[1].id,
                ativo: true
            },
            {
                titulo: 'Alimentação para Aumentar a Testosterona Naturalmente',
                descricao_curta: 'Descubra alimentos que podem ajudar a manter níveis saudáveis de testosterona.',
                conteudo_completo: `A testosterona é fundamental para a saúde masculina, e a alimentação pode influenciar seus níveis naturalmente.

## Alimentos Benéficos:
- Zinco: ostras, carne vermelha, sementes de abóbora
- Vitamina D: peixes gordurosos, ovos
- Gorduras saudáveis: abacate, nozes, azeite
- Vegetais crucíferos: brócolis, couve-flor

## Alimentos a Evitar:
- Açúcar refinado em excesso
- Álcool em grandes quantidades
- Produtos ultraprocessados
- Excesso de soja

## Dicas Importantes:
- Mantenha peso saudável
- Pratique exercícios regulares
- Durma bem (7-9 horas)
- Gerencie o estresse`,
                thumbnail_url: 'https://example.com/testosterone-food-thumbnail.jpg',
                nivel_dificuldade: 'BASICO',
                autor: 'Nutricionista Ana Costa',
                fonte_credivel: 'Conselho Federal de Nutricionistas',
                categoria_id: categorias[4].id,
                tipo_conteudo_id: tiposConteudo[0].id,
                destaque: true,
                ativo: true
            }
        ];

        for (const conteudoData of conteudos) {
            await prisma.conteudo.create({ data: conteudoData });
        }

        console.log('Conteúdos criados:', conteudos.length);
        console.log('✅ Dados de conteúdo criados com sucesso!');

    } catch (error) {
        console.error('❌ Erro ao criar dados:', error);
        throw error;
    }
}

seedConteudo()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
