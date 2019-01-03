import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { authenticate } from './auth';
import { getChats, createChat, createChatByEmail } from './chat';
import { getChatMessages, createChatMessage } from './message';
import { createUser } from './user';

const router = new Router();

router.post('/auth', authenticate);

router.post('/users', createUser);

router.get('/chats', verifyToken, getChats);
router.post('/chats', verifyToken, createChat);
router.post('/chatsByEmail', verifyToken, createChatByEmail);

router.get('/chats/:chatId/messages', verifyToken, getChatMessages);
router.post('/chats/:chatId/messages', verifyToken, createChatMessage);

export default router;
