import express from 'express';
import router from './router';

const port = 3000;
const app = express();

app.use(express.json());
app.use(router);

app.listen(port, () => {
  console.log(`Server is running at: http://localhost:${port}`);
});
