import express from 'express';
import { getTimerByName, createTimeline } from '../../app/controllers/timerController.js';

const router = express.Router();

router.post('/', createTimeline);
router.get('/:timerName', getTimerByName);

export default router;
