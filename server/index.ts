import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './router';
// import { fetchAndSaveTLEData } from './services/apiService';

const app = express();
const port = 3000;
const mongoUri = 'mongodb://127.0.0.1:27017/satellitesdb';

app.use(cors());
app.use(express.json());
app.use(router);

// ! Use only for development -> manually fetch and save data with: 'curl http://localhost:3000/fetch-tle'

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running at: http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// ! Use to automatically fetch api data, every 2 hours:

// mongoose
//   .connect(mongoUri)
//   .then(() => {
//     console.log('Connected to MongoDB');
//     app.listen(port, () => {
//       console.log(`Server is running at: http://localhost:${port}`);
//     });

// // Fetch and save data every 2 hours
//     fetchAndSaveTLEData(); // Initial call
//     setInterval(fetchAndSaveTLEData, 2 * 60 * 60 * 1000); // Repeat every 2 hours
//   })
//   .catch((err) => {
//     console.error('Error connecting to MongoDB:', err);
//   });
