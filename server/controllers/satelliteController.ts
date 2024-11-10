import { Request, Response } from 'express';
import Satellite from '../models/SatelliteDataModel';
import { fetchAndSaveTLEData } from '../services/apiService';

export const getSatellites = async (req: Request, res: Response) => {
  try {
    const satellites = await Satellite.find().exec();
    const lastUpdateTimestamp =
      satellites.length > 0 ? satellites[0].lastUpdateTimestamp : new Date();
    res.status(200).json({ satellites, lastUpdateTimestamp });
  } catch (err) {
    console.error('Error retrieving satellite data:', err);
    res.status(500).json({ message: 'Error fetching satellite data' });
  }
};

export const updateTLEData = async (req: Request, res: Response) => {
  try {
    await fetchAndSaveTLEData();
    res.status(200).send('TLE Data fetched and saved successfully.');
  } catch (err) {
    console.error('Error fetching TLE data:', err);
    res.status(500).send('Failed to fetch and save TLE data.');
  }
};
