import { Router } from 'express';
import { getSatellites } from './controllers/satelliteController';

const router = Router();

router.get('/', getSatellites);

export default router;
