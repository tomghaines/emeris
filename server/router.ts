import express from 'express';
import {
  getSatellites,
  updateTLEData,
} from './controllers/satelliteController';

const router = express.Router();
router.get('/satellites', getSatellites);
router.get('/fetch-tle', updateTLEData);

export default router;
