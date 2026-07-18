import express from 'express';
import contactRouter from './routers/contactRouter.js';

const router = express.Router();

router.use('/contact', contactRouter);

export default router;