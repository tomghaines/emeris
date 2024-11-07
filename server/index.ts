import express from 'express';
import router from './router';
import cors from 'cors';

const port = 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Server is running at: http://localhost:${port}`);
});
