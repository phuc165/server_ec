import express from 'express';
import apiRouter from './api/index.js';
import keys from '../config/key.js';

const router = express.Router();
const { apiURL } = keys.app;
const api = `/${apiURL}`;

router.use(api, apiRouter);
router.use(api, (req, res) => res.status(404).json('No API route found'));

export default router;
