import mongoose from 'mongoose';

const satelliteSchema = new mongoose.Schema({
  satelliteId: Number,
  name: String,
  date: String,
  longitudeDeg: Number,
  latitudeDeg: Number,
  height: Number,
  azimuth: Number,
  elevation: Number,
  rangeSat: Number,
  doppler: Number,
  lastUpdateTimestamp: { type: Date, required: true },
});

export default mongoose.model('Satellite', satelliteSchema);
