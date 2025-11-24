import express from 'express';
import {
	createTopic,
	listTopics,
	createPseudonym,
	createPost,
	listPosts,
	createReply,
	deletePost
} from '../controllers/forumController.js';
import auth from '../middlewares/auth.middleware.js';
const router = express.Router();

// Tópicos
router.post('/topics', auth, createTopic);
router.get('/topics', auth, listTopics);

// Pseudônimo
router.post('/forum/pseudonym', auth, createPseudonym);

// Posts
router.post('/forum/posts', auth, createPost);
router.get('/forum/topics/:topicId/posts', auth, listPosts);

// Respostas
router.post('/forum/replies', auth, createReply);

// Moderação
router.delete('/forum/posts/:postId', auth, deletePost);

export default router;
