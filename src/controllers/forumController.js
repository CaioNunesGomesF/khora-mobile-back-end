import { PrismaClient } from '../generated/prisma/client.js';
const prisma = new PrismaClient();

// Criar tópico
async function createTopic(req, res) {
  try {
    const { title } = req.body;
    const topic = await prisma.forumTopic.create({ data: { title } });
    res.status(201).json(topic);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Listar tópicos
async function listTopics(req, res) {
  try {
    const topics = await prisma.forumTopic.findMany();
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Criar pseudônimo para usuário em um tópico
async function createPseudonym(req, res) {
  try {
    const { topicId } = req.body;
    const userId = req.user.id;
    // Gera pseudônimo simples (pode ser aprimorado)
    const name = `Anon${Math.floor(Math.random() * 10000)}`;
    const pseudonym = await prisma.forumPseudonym.create({
      data: { topicId, userId, name }
    });
    res.status(201).json({ pseudonym: pseudonym.name });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Criar post anônimo
async function createPost(req, res) {
  try {
    const { topicId, pseudonymId, content } = req.body;
    const post = await prisma.forumPost.create({
      data: { topicId, pseudonymId, content }
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Listar posts de um tópico
async function listPosts(req, res) {
  try {
    const { topicId } = req.params;
    const posts = await prisma.forumPost.findMany({
      where: { topicId: Number(topicId) },
      include: { pseudonym: true, replies: true }
    });
    // Remove userId do pseudonym
    const sanitized = posts.map(post => ({
      ...post,
      pseudonym: { name: post.pseudonym.name },
      replies: post.replies.map(r => ({ ...r, pseudonym: { name: r.pseudonym.name } }))
    }));
    res.json(sanitized);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Criar resposta anônima
async function createReply(req, res) {
  try {
    const { postId, pseudonymId, content } = req.body;
    const reply = await prisma.forumReply.create({
      data: { postId, pseudonymId, content }
    });
    res.status(201).json(reply);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Endpoints de moderação (exemplo: deletar post)
async function deletePost(req, res) {
  try {
    const { postId } = req.params;
    await prisma.forumPost.delete({ where: { id: Number(postId) } });
    res.status(200).json({ deleted: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export {
  createTopic,
  listTopics,
  createPseudonym,
  createPost,
  listPosts,
  createReply,
  deletePost
};
