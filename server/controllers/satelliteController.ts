import { Request, Response } from 'express';
import { getTLEs } from '../services/apiService';

export const getSatellites = async (req: Request, res: Response) => {
  try {
    const result = await getTLEs();
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching satellite data' });
  }
};
