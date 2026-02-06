import express from 'express';
import cors from 'cors';
import { router } from './routes/analyze.routes';

export const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api', router);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
